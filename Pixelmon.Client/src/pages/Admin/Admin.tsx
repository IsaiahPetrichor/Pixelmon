import './Admin.css';
import WorkItemList from '../../components/WorkItems/WorkItemList';

function Admin() {
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <p className="eyebrow">Admin workspace</p>
          <h2>Welcome back</h2>
          <p>You are verified and can manage Pixelmon project data from here.</p>
        </div>
      </div>
      <div className="admin-placeholder">
        <h3>Work items</h3>
        <WorkItemList />
      </div>
    </section>
  );
}

export default Admin;
