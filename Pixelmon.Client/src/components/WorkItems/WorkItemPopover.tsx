import { useState, type SubmitEvent } from 'react';
import type { WorkItem } from '../../types/WorkItem';
import type { PokemonRegion } from '../../types/PokemonRegion';
import type { PokemonRoute } from '../../types/PokemonRoute';
import type { WorkArea } from '../../types/WorkArea';
import type { Staff } from '../../types/Staff';
import type { WorkItemStatus } from '../../types/WorkItemStatus';
import { VscClose } from 'react-icons/vsc';

import './WorkItemPopover.css';

type WorkItemPopoverProps = {
  workItem: WorkItem | null;
  regions: PokemonRegion[];
  routes: PokemonRoute[];
  workAreas: WorkArea[];
  staff: Staff[];
  statuses: WorkItemStatus[];
  onClose: () => void;
  onSaved: () => void;
};

const apiBaseUrl = import.meta.env.VITE_API_URL;
const authTokenKey = import.meta.env.VITE_AUTH_STORAGE_KEY;

function WorkItemPopover({
  workItem,
  regions,
  routes,
  workAreas,
  staff,
  statuses,
  onClose,
  onSaved,
}: WorkItemPopoverProps) {
  const [regionId, setRegionId] = useState(workItem?.regionId ?? regions[0]?.id ?? 0);
  const [routeId, setRouteId] = useState(workItem?.routeId ?? 0);
  const [workAreaId, setWorkAreaId] = useState(workItem?.workAreaId ?? workAreas[0]?.id ?? 0);
  const [assignedToId, setAssignedToId] = useState(workItem?.assignedToId ?? 0);
  const [statusId, setStatusId] = useState(workItem?.statusId ?? statuses[0]?.id ?? 0);
  const [shortDescription, setShortDescription] = useState(workItem?.shortDescription ?? '');
  const [longDescription, setLongDescription] = useState(workItem?.longDescription ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const availableRoutes = routes.filter((route) => route.regionId === regionId);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    const token = sessionStorage.getItem(authTokenKey);
    const request = { regionId, routeId, assignedToId, workAreaId, statusId, shortDescription, longDescription };

    try {
      const response = await fetch(
        `${apiBaseUrl}/WorkItem/${workItem ? `UpdateWorkItem/${workItem.id}` : 'AddWorkItem'}`,
        {
          method: workItem ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(request),
        },
      );

      if (!response.ok) throw new Error('Unable to save work item.');
      onSaved();
    } catch {
      setError('Unable to save the work item. Check the values and try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="work-item-popover-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="work-item-popover"
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-item-popover-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="work-item-popover-heading">
          <div>
            <p className="eyebrow">Work item</p>
            <h3 id="work-item-popover-title">{workItem ? 'Edit work item' : 'Create work item'}</h3>
          </div>
          <button className="popover-close-button" type="button" onClick={onClose} aria-label="Close work item form">
            <VscClose style={{ height: '31px', width: '31px' }} />
          </button>
        </div>
        <form className="work-item-form" onSubmit={handleSubmit}>
          <label>
            Region
            <select
              value={regionId}
              onChange={(event) => {
                const nextRegionId = Number(event.target.value);
                const nextRoutes = routes.filter((route) => route.regionId === nextRegionId);
                setRegionId(nextRegionId);
                setRouteId(nextRoutes[0]?.id ?? 0);
              }}
              required
            >
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.regionName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Location
            <select value={routeId} onChange={(event) => setRouteId(Number(event.target.value))} required>
              {availableRoutes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.routeName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Work area
            <select value={workAreaId} onChange={(event) => setWorkAreaId(Number(event.target.value))} required>
              {workAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.areaName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Assigned to
            <select value={assignedToId} onChange={(event) => setAssignedToId(Number(event.target.value))}>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.username}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={statusId} onChange={(event) => setStatusId(Number(event.target.value))} required>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.statusName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Title
            <input value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} required />
          </label>
          <label className="work-item-form-wide">
            Description
            <textarea value={longDescription} onChange={(event) => setLongDescription(event.target.value)} rows={4} />
          </label>
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          <div className="work-item-form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save work item'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default WorkItemPopover;
