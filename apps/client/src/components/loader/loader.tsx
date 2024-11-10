import styles from './loader.module.scss';
import React from 'react';
const {
    container,
    weather,
    cloud,
    front,
    back,
    sun,
    sunshine,
    leftFront,
    leftBack,
    rightFront,
    rightBack,
} = styles;

const Loader: React.FC = () => {
    return (
        <div className={container}>
            <div className={weather}>
                <div className={`${cloud} ${front}`}>
                    <span className={leftFront}></span>
                    <span className={rightFront}></span>
                </div>
                <span className={`${sun} ${sunshine}`}></span>
                <span className={sun}></span>
                <div className={`${cloud} ${back}`}>
                    <span className={leftBack}></span>
                    <span className={rightBack}></span>
                </div>
            </div>
        </div>
    );
};

export default Loader;
