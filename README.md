# react-native-progress-button
A react native button component that can show progress.

![ScreenShot-ios](https://github.com/xinghui0000/react-native-progress-button/blob/master/screenshots/react-native-progress-demo-ios.gif?raw=true)
![ScreenShot-android](https://github.com/xinghui0000/react-native-progress-button/blob/master/screenshots/react-progress-button-demo-android.gif?raw=true)

## Installation
`
$ npm install react-native-progress-button --save
`

## Usage
```
import {ProgressButton} from 'react-native-progress-button';

<ProgressButton {...props}/>
```

### Properties
Props | Description | Default 
------- | ------- |------- 
`style` | button style<br> -`width`: width of button<br> -`height`:height of button.<br> -`borderWidth`:width of outer border. <br>-`borderRadius`: radius of outer border, this will influence inner progress view in android.<br> -`backgroundColor`: background color of button, not visiable when `buttonState` is 'static'.<br> -`padding`: padding area betweenn outer border and inner progresss view  | -`width`:400<br> -`height`:40<br> -`borderWidth`:0<br> -`borderRadius`:5<br>-`backgroundColor`:'limegreen'<br>-`padding`:0
`buttonState` | the state which control button whether in progress, one of three follow value:<br>-`'staic'`: static button, button not in progress.<br>-`'indeterminate'`: indeterminate progress button, `activityIndicator` is shown.<br>-`'progress'`: like progress bar. | `'static'`
`smoothly` | whether the progress is smooth,only used when `buttonState` is `'progress'` | `true`
`paused` | Whether to pause the animation of progress,<br>-`false`: pause a progress animation or deley new progress animation start.<br>-`true`: restart a progress animation, The progress speed is the same as before the pause, **so try not set `timingConfig` before restart the progress**| `false`
`timingConfig` | config of the [Animated.timing()](https://facebook.github.io/react-native/docs/animated.html#timing) in which smooth progress animation used. `duration`, `delay`, `easing` | `{duration: 100}`
