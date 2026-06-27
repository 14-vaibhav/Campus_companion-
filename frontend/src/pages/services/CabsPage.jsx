import DriverListPage from './DriverListPage';
import { getCabs } from '../../services/dataService';
export default function CabsPage() {
  return <DriverListPage title="Campus Cabs" icon="directions_car" color="#10b981" bg="#d1fae5" fetchAll={getCabs} serviceType="cabs" />;
}
