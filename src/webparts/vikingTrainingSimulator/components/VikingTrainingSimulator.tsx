import * as React from 'react';
import styles from './VikingTrainingSimulator.module.scss';
import { IVikingTrainingSimulatorProps } from './IVikingTrainingSimulatorProps';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as Helpers from '../helpers/helpers';
import { UnitSelector } from './UnitSelector/UnitSelector';
import { IKing } from '../models/IKing';
import { IUnit } from '../models/IUnit';
import { PrimaryButton } from 'office-ui-fabric-react';
import { clone } from '@microsoft/sp-lodash-subset';


const { useEffect, useState } = React;

export const VikingTrainingSimulator: React.FC<IVikingTrainingSimulatorProps> = (props: IVikingTrainingSimulatorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentKing, setKing]: [IKing, React.Dispatch<any>] = useState(null);
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit]: [IUnit, React.Dispatch<any>] = useState(null);

  const udpateUnitXP = async (userEmail: string, unitId: string, newXP: number) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body =
    {
      email: userEmail,
      id: unitId,
      XP: newXP
    };
    try {
      await fetch(`https://pillagers-storage-functions.azurewebsites.net/api/SetXp`, {
        headers,
        method: 'post',
        body: JSON.stringify(body)
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onTrainClick = (userEmail: string, unitId: string, unitXP: number, xpGain: number) => {
    const newXPValue = unitXP + xpGain;
    let unitsCopy: IUnit[] = clone(units);
    unitsCopy.forEach(unit => {
      if (unit.id === unitId) {
        unit['xp'] = newXPValue;
      }
    });
    setUnits(unitsCopy);

    udpateUnitXP(userEmail, unitId, newXPValue);

  };

  const fetchXpTable = async () => {
    const res = await fetch(`https://pillagers-storage-functions.azurewebsites.net/api/GetLevels`);
    const json = await res.json();
    console.log(json);
  };

  const fetchRankRequirements = async () => {
    const res = await fetch(`https://pillagers-storage-functions.azurewebsites.net/api/GetRanks`);
    const json = await res.json();
    console.log(json);
  };

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
      // TOOD: Map these values
      await fetchXpTable();
      await fetchRankRequirements();
      setKing(king);
      setUnits(kingsUnits);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(props.userEmail);
  }, []);

  console.log(currentKing);
  console.log(units);

  return (
    <div className={styles.vikingTrainingSimulator}>
      {isLoading && <Spinner className={styles.loadingSpinner} label='Fetching data...' size={SpinnerSize.large} />}
      {!isLoading && currentKing &&
        <>
          <div className={styles.infoView}>
            <div className={styles.kingInfo}>
              {
                <>
                  <div>{currentKing.firstName} {currentKing.lastName}</div>
                  <div>Penning: {currentKing.penning}</div>
                </>
              }
            </div>
            {selectedUnit &&
              <div className={styles.selectedUnit}>
                {`Selected Unit: ${selectedUnit.firstName} ${selectedUnit.lastName}`}
                <div className={styles.unitStats}>
                  <div>XP: {selectedUnit.xp}</div>
                  <div>Level: {selectedUnit.level}</div>
                  <div>Rank: {selectedUnit.rank}</div>
                  <div>Status: {selectedUnit.dead ? 'Dead' : 'Alive'}</div>
                </div>
                <PrimaryButton text='Train!' onClick={() => onTrainClick(props.userEmail, selectedUnit.id, selectedUnit.xp, currentKing.XPGain)} />
              </div>
            }
          </div>
          <div>
            <UnitSelector
              units={units}
              setSelectedUnit={setSelectedUnit}
            />
          </div>
        </>
      }
    </div >
  );
};
