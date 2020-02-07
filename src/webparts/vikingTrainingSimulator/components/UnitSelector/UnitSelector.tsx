import * as React from 'react';
import styles from './UnitSelector.module.scss';
import { IUnitSelectorProps } from './IUnitSelectorProps';
import { DetailsList, IColumn, CheckboxVisibility } from 'office-ui-fabric-react';

const onRenderItemColumn = (item?: any, index?: number, column?: IColumn) => {
  switch (column.key) {
    case 'unit':
      return `${item.firstName} ${item.lastName}`;
    case 'lvl':
      return `Level ${item.level}`;

    case 'rank':
      return item.rank;
    default:
      break;
  }
};

const onUnitSelected = (item?: any, setSelectedUnit?: React.Dispatch<any>) => {
  setSelectedUnit(item);
};

export const UnitSelector: React.FC<IUnitSelectorProps> = (props: IUnitSelectorProps) => {
  return (
    <div className={styles.unitSelector}>
      <h3>Select unit to train</h3>
      <DetailsList
        styles={{ root: { backgroundColor: '#1ab188' } }}
        items={props.units}
        isHeaderVisible={false}
        selectionPreservedOnEmptyClick
        columns={[
          { key: 'unit', name: 'Unit', minWidth: 100, maxWidth: 300 },
          { key: 'lvl', name: 'Level', minWidth: 50, maxWidth: 100 },
          { key: 'rank', name: 'Rank', minWidth: 50, maxWidth: 100 }
        ]}
        onRenderItemColumn={onRenderItemColumn}
        checkboxVisibility={CheckboxVisibility.hidden}
        onActiveItemChanged={(item) => onUnitSelected(item, props.setSelectedUnit)}
      />
    </div>
  );
};

