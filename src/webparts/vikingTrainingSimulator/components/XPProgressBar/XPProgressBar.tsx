import * as React from 'react';
import styles from '../VikingTrainingSimulator.module.scss';

export interface IXPProgressBarProps {
  color?: string;
  completed?: number;
  prevTotal?: number;
  total?: number;
  animation?: number;
  height?: number;
  className?: string;
  text?: string;
}


export const XPProgressBar: React.FC<IXPProgressBarProps> = (props: IXPProgressBarProps) => {

  const defaultProps = {
    completed: 0,
    prevTotal: 0,
    color: '#0BD318',
    animation: 200,
    height: 10
  };
  const { color, completed, animation, height, className, text, prevTotal, total, ...rest } = props;

  let progress = completed >= prevTotal ? completed - prevTotal : completed;
  if (prevTotal === completed) {
    progress = 0;
  }
  console.log(`PROGRESS:  ${progress}`);
  console.log(`RANGE: ${total-prevTotal}`);
  const percentage = (progress * 100 / (total-prevTotal));
  let style = {
    backgroundColor: color ? color : defaultProps.color,
    width: percentage ? percentage + '%' : defaultProps.completed + '%',
    transition: animation ? `width ${animation}ms` : `width ${defaultProps.animation}ms`,
    height: height ? height : defaultProps.height
  };
  if (completed && total && completed >= total) {
    style['width'] = '0%';
  }
  console.log(style);
  return (
    <div className={className} {...rest}>
      <div className="progressbarProgress" style={style}>{text}</div>
    </div>
  );
};
