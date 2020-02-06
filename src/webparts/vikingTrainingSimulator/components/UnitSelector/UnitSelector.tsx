import * as React from 'react';
import styles from './UnitSelector.module.scss';
import { IUnitSelectorProps } from './IUnitSelectorProps';
import { DetailsList, IColumn, CheckboxVisibility } from 'office-ui-fabric-react';

const onRenderItemColumn = (item?: any, index?: number, column?: IColumn) => {
  return `${item.firstName} ${item.lastName}`;
};

const onUnitSelected = (item?: any, setSelectedUnit?: React.Dispatch<any>) => {
  setSelectedUnit(item);
};

export const UnitSelector: React.FC<IUnitSelectorProps> = (props: IUnitSelectorProps) => {
  return (
    <div className={styles.unitSelector}>
      <DetailsList
        items={props.units}
        isHeaderVisible={false}
        columns={[{ key: 'unit', name: 'Unit', minWidth: 100, maxWidth: 300 }]}
        onRenderItemColumn={onRenderItemColumn}
        checkboxVisibility={CheckboxVisibility.hidden}
        onActiveItemChanged={(item) => onUnitSelected(item, props.setSelectedUnit)}
      />
    </div>
  );
};

