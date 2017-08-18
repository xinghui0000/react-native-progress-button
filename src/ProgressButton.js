import React from 'react';
import {View, TouchableWithoutFeedback, Platform, Text, ActivityIndicator, Animated, processColor} from 'react-native';
import PropTypes from 'prop-types';


class ProgressButton extends React.Component {
    constructor(props) {
        super(props);
        const {
            width,
            borderWidth,
            padding
        } = this.props.style;

        const {
            smoothly,
            buttonState,
            progress,
            maxProgress,
            paused
        } = this.props;

        this.progressMaxWidth = this._calculateProgressSize(width, borderWidth, padding);


        const progressAnimateValue = new Animated.Value(smoothly? 0 : this._calculateProgressToWidth(progress, maxProgress));
        this.state = {
            progressValue: progressAnimateValue,
            animating: false,
            paused:false,
            text: props.text
        };
        if (buttonState === 'progress' && smoothly && !paused) {
            this._animateProgress(progress);
        }

    }

    _calculateProgressToWidth(progress, maxProgress = this.props.maxProgress){
        return Math.min(progress, maxProgress)/ maxProgress * this.progressMaxWidth;
    }

    _calculateWidthToProgress(width, maxProgress = this.props.maxProgress) {
        return width / this.progressMaxWidth * maxProgress;
    }


    _calculateProgressSize(outSize, borderWidth, padding) {
        return outSize - 2 * borderWidth - 2 * padding;
    }

    _animateProgress(toProgress, timingConfig, maxProgress = this.props.maxProgress) {
        let extraConfig = timingConfig? timingConfig : {};

        Animated.timing(this.state.progressValue, {
            toValue: this._calculateProgressToWidth(toProgress, maxProgress),
            duration: 100,
            ...extraConfig
        }).start(({finished}) => {
            this.state.animating = false;
            if (this.props.onProgressAnimatedFinished && finished) {
                this.props.onProgressAnimatedFinished(toProgress);
            }
        });
        this.state.animating = true;
    }


    _pauseProgressAnimation() {
        this.state.progressValue.stopAnimation((value) => {
            this.state.animating = false;
            this.state.paused = true;
            const {onProgressAnimatedFinished, maxProgress} = this.props;
            if (onProgressAnimatedFinished) {
                onProgressAnimatedFinished(this._calculateWidthToProgress(value, maxProgress))
            }
        });
    }

    _restartProgressAnimation() {
        const {timingConfig, progress} = this.props;
        let leftTimingConfig = {...timingConfig};
        leftTimingConfig.duration = timingConfig.duration / this.progressMaxWidth * this._calculateProgressToWidth(this.progressMaxWidth - this.state.progressValue._value);
        this.state.paused = false;
        this._animateProgress(progress, leftTimingConfig);
    }


    componentWillReceiveProps(nextProps){
        const {
            width,
            borderWidth,
            padding
        } = this.props.style;
        const {
            smoothly,
            maxProgress,
            buttonState,
            timingConfig,
        } = nextProps;

        this.progressMaxWidth = this._calculateProgressSize(width, borderWidth, padding);
        if (buttonState === 'progress' && nextProps.progress !== this.props.progress) {
            if (!smoothly) {
                this.state.progressValue.setValue(this._calculateProgressToWidth(nextProps.progress, maxProgress));
            } else if (!nextProps.paused){
                this._animateProgress(nextProps.progress, timingConfig, maxProgress);
            }
        }

        if (buttonState !== 'progress') {
            this.state.progressValue.setValue(0);
        }
        
        if (buttonState === 'progress' && nextProps.paused != this.props.paused
            && nextProps.progress === this.props.progress
            && nextProps.progress !== this._calculateWidthToProgress(this.state.progressValue._value, maxProgress)) {

            nextProps.paused? this._pauseProgressAnimation() : this._restartProgressAnimation();
        }
    }

    render() {
        const {
            height,
            width,
            borderWidth,
            borderRadius,
            padding
        } = this.props.style;

        const {
            unfilledColor,
            progressColor,
            activityIndicator,
            activityIndicatorPadding,
            textStyle,
            onPress,
            buttonState,
            text,
            maxProgress
        } = this.props;

        const maxHeight = this._calculateProgressSize(height, borderWidth, padding);
        const maxWidth = this._calculateProgressSize(width, borderWidth, padding);
        const progressWrapperRadius = borderRadius - padding;


        const textViewStyle = {
            height: height - borderWidth,
            position: 'absolute',
            alignSelf:'center',
            alignItems:"center",
            justifyContent: 'center',
            flexDirection:'row',
        };

        const _renderProgress = (buttonState) => {
            if (buttonState === 'progress') {
                const innerRadius = progressWrapperRadius > 0? progressWrapperRadius : 0;
                const progressViewWrapperStyle = {
                    flex: 1,
                    height: maxHeight,
                    borderRadius: innerRadius,
                    backgroundColor: unfilledColor,
                    width:maxWidth,
                    overflow:'hidden',
                };

                const progressViewStyle = {
                    ...progressViewWrapperStyle,
                    width: this.state.progressValue,
                    backgroundColor: progressColor,
                    borderRadius:ProgressButton.isAndroid? innerRadius : 0,
                    textAlign:'center'

                };
                return (
                    <View style={progressViewWrapperStyle}>
                        <Animated.View style={progressViewStyle}/>
                    </View>
                );
            }
        };
        const _renderIndeterminateIndicator = (buttonState) => {
            if (buttonState === 'indeterminate') {
                return (
                    activityIndicator
                )
            }
        };
        const _renderTextAndIndeterminateIndicator = (buttonState, text) => {
            const textAllStyle = {
                ...textStyle,
                backgroundColor: 'transparent',
                paddingLeft:buttonState === 'indeterminate'? activityIndicatorPadding : 0
            };
            return (
                <View style={textViewStyle}>
                    {_renderIndeterminateIndicator(buttonState)}
                    <Text style={textAllStyle}>{text}</Text>
                </View>
            );
        };
        const onPressWrapper = (e) => {
            const progress = this._calculateWidthToProgress(this.state.progressValue._value, maxProgress);
            onPress && onPress(e, buttonState, progress);
        };
        return (
            <TouchableWithoutFeedback onPress={onPressWrapper.bind(this)}>
                <View style={{...this.props.style, overflow:'hidden'}}>
                    {_renderProgress(buttonState)}
                    {_renderTextAndIndeterminateIndicator(buttonState, text)}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

ProgressButton.isAndroid = (Platform.OS === 'android');

ProgressButton.propTypes = {
    //static button style
    style: PropTypes.shape({
        width:PropTypes.number,
        height:PropTypes.number,
        borderRadius:PropTypes.number,
        borderWidth:PropTypes.number,
        borderColor:PropTypes.string,
        padding: PropTypes.number,
        backgroundColor:PropTypes.string
    }),

    buttonState: PropTypes.oneOf(['static', 'indeterminate', 'progress']),

    //progress button attrs
    timingConfig: PropTypes.shape({
        easing: PropTypes.string,
        duration: PropTypes.number,
        delay: PropTypes.number
    }),
    paused: PropTypes.bool,
    smoothly: PropTypes.bool,
    progress: PropTypes.number,
    maxProgress:PropTypes.number,
    progressColor:PropTypes.string,
    unfilledColor:PropTypes.string,

    //indeterminate button attrs
    activityIndicator:PropTypes.element,
    activityIndicatorPadding: PropTypes.number,

    text: PropTypes.string,
    textStyle:PropTypes.shape({
        color:PropTypes.string,
        fontFamily: PropTypes.string,
        fontSize: PropTypes.number,
        fontStyle: PropTypes.oneOf(['normal', 'italic']),
    }),
    onPress: PropTypes.func,
    onProgressAnimatedFinished: PropTypes.func
};

ProgressButton.defaultProps = {
    style: {
        width:200,
        height: 40,
        borderWidth:0,
        borderRadius: 5,
        backgroundColor: 'limegreen',
        padding:0
    },
    timingConfig:{
        duration: 100,
    },
    smoothly: true,
    buttonState:'static',
    unfilledColor: 'lightgrey',
    progressColor:'limegreen',
    progress:0,
    maxProgress:100,
    activityIndicator: <ActivityIndicator color={processColor('white')}/>,
    activityIndicatorPadding:4,
    text:'OK',
    textStyle: {
        color: 'white'
    }
};

export default ProgressButton;