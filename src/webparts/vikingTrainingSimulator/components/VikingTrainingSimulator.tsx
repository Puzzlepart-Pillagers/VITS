import * as React from 'react';
import styles from './VikingTrainingSimulator.module.scss';
import { IVikingTrainingSimulatorProps } from './IVikingTrainingSimulatorProps';

export const VikingTrainingSimulator: React.FC<IVikingTrainingSimulatorProps> = (props: IVikingTrainingSimulatorProps) => {
  return(
    <div className={styles.vikingTrainingSimulator}>
      VITS
    </div>
  );
};
