import * as React from 'react';
import styles from './VikingTrainingSimulator.module.scss';
import { IVikingTrainingSimulatorProps } from './IVikingTrainingSimulatorProps';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as Helpers from '../helpers/helpers';
import { UnitSelector } from './UnitSelector/UnitSelector';
import { IKing } from '../models/IKing';
import { IUnit } from '../models/IUnit';
import { PrimaryButton, Modal } from 'office-ui-fabric-react';
import { clone } from '@microsoft/sp-lodash-subset';
import { IXpTable } from '../models/IXpTable';
import { IRank } from '../models/IRank';
import { XPProgressBar } from './XPProgressBar/XPProgressBar';

const { useEffect, useState, useRef } = React;

export const VikingTrainingSimulator: React.FC<IVikingTrainingSimulatorProps> = (props: IVikingTrainingSimulatorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentKing, setKing]: [IKing, React.Dispatch<any>] = useState(null);
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit]: [IUnit, React.Dispatch<any>] = useState(null);
  const [xpTable, setXpTable]: [IXpTable[], React.Dispatch<any>] = useState([]);
  const [ranks, setRanks]: [IRank[], React.Dispatch<any>] = useState([]);
  const [xpToNextLevel, setXpToNextLevel] = useState(null);
  const [prevLevelXpReq, setPreviousXpLevelReq] = useState(null);
  const [rankUp, setRankUp] = useState(null);

  const lvl = useRef(null);

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

  const udpateUnitLevel = async (userEmail: string, unitId: string, newLvl: number) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body =
    {
      email: userEmail,
      id: unitId,
      Level: newLvl
    };
    try {
      await fetch(`https://pillagers-storage-functions.azurewebsites.net/api/SetLevel`, {
        headers,
        method: 'post',
        body: JSON.stringify(body)
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateUnitRank = async (userEmail: string, unitId: string, rank: string) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body =
    {
      email: userEmail,
      id: unitId,
      Rank: rank
    };
    try {
      await fetch(`https://pillagers-storage-functions.azurewebsites.net/api/SetRank`, {
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
        if (newXPValue >= xpToNextLevel) {
          const newLvl = unit['level'] + 1;
          const rank = ranks.filter(r => r.level <= newLvl).reverse()[0].rank;
          console.log(rank);
          unit['level'] = newLvl;
          if (unit['rank'] !== rank) {
            let prevRank = unit['rank'];
            unit['rank'] = rank;
            setRankUp({ unit: selectedUnit, rank, prevRank });
          }
          const nextLevelReq = xpTable.filter(item => item.lvl === newLvl + 1)[0].xp;
          const prevLevelXpRequirement = xpTable.filter(item => item.lvl === selectedUnit.level)[0].xp;
          setXpToNextLevel(nextLevelReq);
          setPreviousXpLevelReq(prevLevelXpRequirement ? prevLevelXpRequirement : 0);
          udpateUnitLevel(userEmail, unitId, newLvl);
          updateUnitRank(userEmail, unitId, rank);
        }
      }
    });
    setUnits(unitsCopy);

    udpateUnitXP(userEmail, unitId, newXPValue);

  };

  const fetchXpTable = async () => {
    const res = await fetch(`https://pillagers-storage-functions.azurewebsites.net/api/GetLevels`);
    const json = await res.json();
    return json.value.map(i => {
      return {
        lvl: i.Level,
        xp: i.ReqXp
      };
    });
  };

  const fetchRankRequirements = async () => {
    const res = await fetch(`https://pillagers-storage-functions.azurewebsites.net/api/GetRanks`);
    const json = await res.json();
    return json.value.map(i => {
      return {
        level: i.Level,
        rank: i.Rank
      };
    });
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
      const table: IXpTable[] = await fetchXpTable();
      const rankReqs: IRank[] = await fetchRankRequirements();
      setXpTable(table);
      setRanks(rankReqs);
      setKing(king);
      setUnits(kingsUnits);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUnit) {
      console.log(lvl.current);
      lvl.current.focus();
    }
  }, [selectedUnit && selectedUnit.level]);

  useEffect(() => {
    if (selectedUnit && xpTable) {
      const nextLevelRequirement =
        xpTable.filter(item => item.lvl === selectedUnit.level + 1)[0] ?
          xpTable.filter(item => item.lvl === selectedUnit.level + 1)[0].xp : 0;
      console.log(xpTable);
      const prevLevelXpRequirement = xpTable.filter(item => item.lvl === selectedUnit.level)[0].xp;
      setXpToNextLevel(nextLevelRequirement ? nextLevelRequirement : 0);
      setPreviousXpLevelReq(prevLevelXpRequirement);
    }
  }, [selectedUnit]);

  useEffect(() => {
    fetchData(props.userEmail);
  }, []);

  const renderRankUpModal = () => {
    setTimeout(() => {
      setRankUp(null);
    }, 4000);
    console.log(rankUp);
    return (
      <div className={styles.rankUpModal}>
        <div className={styles.unitName}> {`${selectedUnit.firstName} ${selectedUnit.lastName} is ranking up!`}</div>
        <div className={styles.ranks}>
          <div className={styles.unitRank}>{rankUp.rank}</div>
          <div className={styles.oldRank}>{rankUp.prevRank}</div>

        </div>
      </div>
    );
  };

  return (
    <div className={styles.vikingTrainingSimulator}>
      {rankUp && <Modal
        isOpen
        isBlocking
      >
        {renderRankUpModal()}
      </Modal>}
      {isLoading && <Spinner className={styles.loadingSpinner} label='Fetching data...' size={SpinnerSize.large} />}
      {!isLoading && currentKing &&
        <>
          <div className={styles.infoView}>
            <div className={styles.kingInfo}>
              <div>{currentKing.firstName} {currentKing.lastName}</div>
              <div>Penning: {currentKing.penning}</div>
            </div>
            {selectedUnit &&
              <div className={styles.selectedUnit}>
                <h3>{selectedUnit.firstName} {selectedUnit.lastName}</h3>
                <div className={styles.levelContainer}>Level:
                <div
                    ref={lvl}
                    onFocus={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    tabIndex={-1}
                    className={styles.level}>
                    {selectedUnit.level}
                  </div>
                </div>
                <div className={styles.unitStats}>
                  <div>XP: {selectedUnit.xp}</div>
                  <span>Next level</span>
                  <XPProgressBar
                    className={styles.progressbarContainer}
                    completed={selectedUnit.xp}
                    text={`${selectedUnit.xp}/${xpToNextLevel}XP`}
                    prevTotal={prevLevelXpReq ? prevLevelXpReq : 0}
                    total={xpToNextLevel}
                    height={20}
                  />

                  <div>Rank: {selectedUnit.rank}</div>
                  <div>Status: {selectedUnit.dead ? 'Dead' : 'Alive'}</div>
                </div>
                <PrimaryButton className={styles.button} text='Train!' onClick={() => onTrainClick(props.userEmail, selectedUnit.id, selectedUnit.xp, currentKing.XPGain)} />
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
    </div>
  );
};
