import { IUnit } from '../../models/IUnit';

export interface IUnitSelectorProps {
  units: IUnit[];
  setSelectedUnit: React.Dispatch<any>;
}
