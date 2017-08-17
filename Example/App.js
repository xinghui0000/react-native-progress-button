import React from 'react';
import {View, StyleSheet, Text, processColor, Image} from 'react-native';
// import ProgressButton from './src/ProgressButton';
import {ProgressButton} from 'react-native-progress-button';
const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        paddingTop: 40
    },
    progressContainer: {
        flexDirection:'column',
        alignItems:'center',
        marginTop:20
    },
    spinProgressButton: {
        width: 100,
        height: 20,
    },
});
class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            continueProgressButton:{
                text:'Tap Me',
            },
            timerButton:{
                text:'Tap Me',
            },
            customStyleButton:{
                style: {
                    width:240,
                    height: 50,
                    borderRadius: 25,
                    borderColor: 'blue',
                    borderWidth:2,
                    backgroundColor: 'red',
                    padding:2,
                },
                progressColor:'white',
                unfilledColor:'grey',
                text:'Tab Me',
                textStyle: {
                    color:'green',
                    fontSize: 12,
                    fontStyle:'italic'
                }
            }
        }
    }
    onContinuePress = (event, buttonState, progress) => {
        console.log('onContinuePress', buttonState, progress);
        if (buttonState === 'static') {
            this.setState((prevState) => {
                return Object.assign({}, prevState, {
                    continueProgressButton:{
                        ...prevState.continueProgressButton,
                        buttonState: 'indeterminate'
                    }
                })
            })
        }
        if (buttonState === 'indeterminate') {
            this.setState((prevState) => {
                return Object.assign({}, prevState, {
                    continueProgressButton: {
                        ...prevState.continueProgressButton,
                        progress: 10,
                        buttonState:'progress',
                        text: 'Press to add progress:' + 10 + '%'
                    }
                })
            });
        }
        if (buttonState === 'progress' && progress > 0 && progress < 100) {
            this.setState((prevState) => {
                return Object.assign({}, prevState, {
                    continueProgressButton: {
                        ...prevState.continueProgressButton,
                        progress: Math.min(progress + 5, 100),
                        text: 'Press to add progress:' + (progress + 5) + '%'
                    }
                })
            })
        }
        if (buttonState === 'progress' && progress >= 100) {
            this.setState((prevState) => {
                return Object.assign({}, prevState, {
                    continueProgressButton: {
                        ...prevState.continueProgressButton,
                        text: 'Completed'
                    }
                })
            })
        }
    };

    onTimerLoadingPress = (event, buttonState, progress) => {
        if (buttonState === 'static') {
            console.log('onTimerLoadingPress-restart');
            this.setState({
                timerButton: {
                    timingConfig:{
                        duration:10000,
                    },
                    buttonState:'progress',
                    progress:100,
                    text:'Timing',
                    paused: false
                }
            })
        }
        if (buttonState === 'progress') {
            this.setState((prevState) => {
                return {
                    timerButton: {
                        ...this.state.timerButton,
                        paused: !prevState.timerButton.paused,
                        text: prevState.timerButton.paused? 'Timing' : 'Restart'
                    }
                };
            });
        }
    };
    onTimerFinished = (progress)=> {
        if (progress === 100) {
            this.setState({
                timerButton: {
                    ...this.timerButton,
                    text:'Completed'
                }
            });
        }
    };

    onCustomButtonPress = (event, buttonState) => {
        if (buttonState === 'static') {
            this.setState((prevState) => {
                return Object.assign({}, prevState, {
                    customStyleButton:{
                        ...prevState.customStyleButton,
                        buttonState:'indeterminate',
                        progress:0
                    }
                })
            })
        }
        if (buttonState === 'indeterminate') {
            this.setState((prevState) => {
                return Object.assign({}, prevState, {
                    customStyleButton:{
                        ...prevState.customStyleButton,
                        timingConfig:{
                            duration:10000,
                        },
                        buttonState:'progress',
                        progress:100,
                        text:'Timing',
                        paused: false
                    }
                })
            })
        }
        if (buttonState === 'progress') {
            this.setState((prevState) => {
                return Object.assign({}, prevState, {
                    customStyleButton:{
                        ...prevState.customStyleButton,
                        buttonState:'static',
                    }
                })
            })
        }
    };
    customIndicator = <Image style={{width: 20, height: 20}} source={require('./src/resource/loading.gif')}></Image>;

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.progressContainer}>
                    <Text>Continue Progress Button</Text>
                    <ProgressButton
                        {...this.state.continueProgressButton}
                        onPress={this.onContinuePress.bind(this)}/>
                </View>

                <View style={styles.progressContainer}>
                    <Text>Timer Button</Text>
                    <ProgressButton
                        {...this.state.timerButton}
                        onPress={this.onTimerLoadingPress.bind(this)}
                        onProgressAnimatedFinished={this.onTimerFinished.bind(this)}
                        paused={this.state.timerButton.paused}/>
                </View>
                <View style={styles.progressContainer}>
                    <Text>Custom Style Button</Text>
                    <ProgressButton
                        {...this.state.customStyleButton}
                        activityIndicator={this.customIndicator}
                        onPress={this.onCustomButtonPress.bind(this)}
                    />
                </View>
            </View>
        );
    }
}
export default App;