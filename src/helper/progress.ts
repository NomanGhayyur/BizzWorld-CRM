import React from 'react';
import { IProgressInstance } from 'elements';

export const progressRef = React.createRef<IProgressInstance>();

export const setProgress: IProgressInstance['setProgress'] = (progress) => {
    if(progressRef.current) return progressRef.current.setProgress(progress)
}