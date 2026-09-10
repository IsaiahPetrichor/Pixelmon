import './Admin.css';
import WorkItemList from '../../components/WorkItems/WorkItemList';

type AdminProps = {
  onSignOut: () => void;
};

function Admin({ onSignOut }: AdminProps) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <p className="eyebrow">Admin workspace</p>
          <h2>Welcome back</h2>
          <p>You are verified and can manage Pixelmon project data from here.</p>
        </div>
        <button className="secondary-button" type="button" onClick={onSignOut}>
          Sign Out
        </button>
      </div>
      <div className="admin-placeholder">
        <h3>Work items</h3>
        <WorkItemList />
      </div>
    </section>
  );
}

export default Admin;
