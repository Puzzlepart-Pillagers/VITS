import * as React from 'react';
import styles from './VikingTrainingSimulator.module.scss';
import { IVikingTrainingSimulatorProps } from './IVikingTrainingSimulatorProps';
import * as Helpers from '../helpers/helpers';
import { UnitSelector } from './UnitSelector/UnitSelector';
import { IKing } from '../models/IKing';
import { IUnit } from '../models/IUnit';


const { useEffect, useState } = React;

export const VikingTrainingSimulator: React.FC<IVikingTrainingSimulatorProps> = (props: IVikingTrainingSimulatorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentKing, setKing] = useState(null);
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const fetchUnits = async (userEmail: string) => {
    const res = await fetch(`https://pillagers-storage-functions.azurewebsites.net/api/GetUnits?email=${userEmail}`);
    const json = await res.json();
    return Helpers.mapJsonToUnits(json);
  };
  const fetchKing = async (userEmail: string) => {
    const res = await fetch(`https://pillagers-storage-functions.azurewebsites.net/api/GetKing?email=${userEmail}`);
    const json = await res.json();
    return Helpers.mapJsonToKing(json);
  };

  const fetchData = async (userEmail: string) => {
    const king: IKing = await fetchKing(userEmail);
    if (king) {
      const kingsUnits: IUnit[] = await fetchUnits(userEmail);
      setKing(king);
      setUnits(kingsUnits);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(props.userEmail);
  }, []);

  console.log(units);
  if (!isLoading && currentKing) {

    return (
      <>
        <div className={styles.vikingTrainingSimulator}>
          <div className={styles.infoView}>
            <div className={styles.kingInfo}>
              {`Email: ${currentKing.email} Penning: ${currentKing.penning}`}
            </div>
            {selectedUnit &&
              <div>
                {`Selected Unit: ${selectedUnit.firstName} ${selectedUnit.lastName}`}
              </div>
            }
          </div>
          <div>
            <UnitSelector
              units={units}
              setSelectedUnit={setSelectedUnit}
            />
          </div>
        </div>
      </>
    );
  } else return <div></div>;
};
