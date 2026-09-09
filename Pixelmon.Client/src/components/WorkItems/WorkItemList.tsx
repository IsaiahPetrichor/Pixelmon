import { useEffect, useState } from 'react';
import type { WorkItem } from '../../types/WorkItem';
import type { PokemonRegion } from '../../types/PokemonRegion';
import type { PokemonRoute } from '../../types/PokemonRoute';
import type { WorkArea } from '../../types/WorkArea';
import type { Staff } from '../../types/Staff';
import type { WorkItemStatus } from '../../types/WorkItemStatus';
import WorkItemPopover from './WorkItemPopover';

import './WorkItemList.css';
import { VscTrash } from 'react-icons/vsc';

const apiBaseUrl = import.meta.env.VITE_API_URL;
const authTokenKey = import.meta.env.VITE_AUTH_STORAGE_KEY;

function WorkItemList() {
  const [regions, setRegions] = useState<PokemonRegion[]>([]);
  const [routes, setRoutes] = useState<PokemonRoute[]>([]);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [statuses, setStatuses] = useState<WorkItemStatus[]>([]);
  const [selectedWorkItem, setSelectedWorkItem] = useState<WorkItem | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  function refreshWorkItems() {
    const token = sessionStorage.getItem(authTokenKey);
    if (!token) return;

    fetch(`${apiBaseUrl}/DatabaseRaw/GetWorkItems`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error();

        return response.json();
      })
      .then((data) => setWorkItems(data));
  }

  function openWorkItem(workItem: WorkItem) {
    setSelectedWorkItem(workItem);
    setIsPopoverOpen(true);
  }

  async function deleteWorkItem(workItem: WorkItem) {
    if (!window.confirm(`Delete "${workItem.shortDescription}"?`)) return;

    const token = sessionStorage.getItem(authTokenKey);
    if (!token) return;

    setDeleteError('');

    try {
      const response = await fetch(`${apiBaseUrl}/WorkItem/DeleteWorkItem/${workItem.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error();
      refreshWorkItems();
    } catch {
      setDeleteError('Unable to delete the work item. Please try again.');
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem(authTokenKey);
    if (!token) return;

    refreshWorkItems();

    const regionsResponse = fetch(`${apiBaseUrl}/DatabaseRaw/GetRegions`).then((response) => {
      if (!response.ok) throw new Error();

      return response.json();
    });
    regionsResponse.then((data) => {
      setRegions(data);
    });

    const routesResponse = fetch(`${apiBaseUrl}/DatabaseRaw/GetRoutes`).then((response) => {
      if (!response.ok) throw new Error();

      return response.json();
    });
    routesResponse.then((data) => {
      setRoutes(data);
    });

    const workAreasResponse = fetch(`${apiBaseUrl}/DatabaseRaw/GetWorkAreas`).then((response) => {
      if (!response.ok) throw new Error();

      return response.json();
    });
    workAreasResponse.then((data) => {
      setWorkAreas(data);
    });

    const staffResponse = fetch(`${apiBaseUrl}/DatabaseRaw/GetUsers`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (!response.ok) throw new Error();

      return response.json();
    });
    staffResponse.then((data) => {
      setStaff(data);
    });

    const statusesResponse = fetch(`${apiBaseUrl}/DatabaseRaw/GetWorkItemStatuses`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (!response.ok) throw new Error();

      return response.json();
    });
    statusesResponse.then((data) => {
      setStatuses(data);
    });
  }, []);

  return (
    <>
      <div className="work-item-list-toolbar">
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setSelectedWorkItem(null);
            setIsPopoverOpen(true);
          }}
        >
          Create work item
        </button>
      </div>
      {deleteError && (
        <p className="admin-error" role="alert">
          {deleteError}
        </p>
      )}
      <table className="work-item-list">
        <thead>
          <tr>
            <th>Id</th>
            <th>Region</th>
            <th>Location</th>
            <th>Title</th>
            <th>Work Area</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {workItems.length > 0 ? (
            workItems.map((workItem) => {
              const currentRegion = regions.find((region) => region.id == workItem.regionId);
              const currentRoute = routes.find((route) => route.id == workItem.routeId);
              const currentWorkArea = workAreas.find((workArea) => workArea.id == workItem.workAreaId);
              const currentStaff = staff.find((staff) => staff.id == workItem.assignedToId);
              const currentStatus = statuses.find((itemStatus) => itemStatus.id == workItem.statusId);

              return (
                <tr
                  key={workItem.id}
                  aria-label={`Edit ${workItem.shortDescription}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => openWorkItem(workItem)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openWorkItem(workItem);
                    }
                  }}
                >
                  <td>{workItem.id}</td>
                  <td>{currentRegion ? currentRegion.regionName : 'UNKNOWN'}</td>
                  <td>{currentRoute ? currentRoute.routeName : 'UNKNOWN'}</td>
                  <td>{workItem.shortDescription}</td>
                  <td>{currentWorkArea ? currentWorkArea.areaName : 'UNKNOWN'}</td>
                  <td>{currentStaff ? currentStaff.username : 'Unassigned'}</td>
                  <td>{currentStatus ? currentStatus.statusName : 'UNKNOWN'}</td>
                  <td>
                    <button
                      className="delete-work-item-button"
                      type="button"
                      aria-label={`Delete ${workItem.shortDescription}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteWorkItem(workItem);
                      }}
                    >
                      <VscTrash style={{ height: '1.2rem', width: '1.2rem' }} />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8}>No work items found</td>
            </tr>
          )}
        </tbody>
      </table>
      {isPopoverOpen && (
        <WorkItemPopover
          workItem={selectedWorkItem}
          regions={regions}
          routes={routes}
          workAreas={workAreas}
          staff={staff}
          statuses={statuses}
          onClose={() => setIsPopoverOpen(false)}
          onSaved={() => {
            setIsPopoverOpen(false);
            refreshWorkItems();
          }}
        />
      )}
    </>
  );
}

export default WorkItemList;
