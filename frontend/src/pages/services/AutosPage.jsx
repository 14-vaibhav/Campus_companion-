import DriverListPage from './DriverListPage';
import { getAutos } from '../../services/dataService';
export default function AutosPage() {
  return <DriverListPage title="Campus Autos" icon="electric_rickshaw" color="#f43f5e" bg="#ffe4e6" fetchAll={getAutos} serviceType="autos" />;
}
