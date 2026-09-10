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
import { authenticatedFetch } from '../../apiClient';

const apiBaseUrl = import.meta.env.VITE_API_URL;
const authTokenKey = import.meta.env.VITE_AUTH_STORAGE_KEY;
const rowsPerPage = 50;
type SortColumn = 'id' | 'region' | 'location' | 'title' | 'workArea' | 'assignedTo' | 'status';
type SortDirection = 'ascending' | 'descending';

const sortLabels: Record<SortColumn, string> = {
  id: 'Id',
  region: 'Region',
  location: 'Location',
  title: 'Title',
  workArea: 'Work Area',
  assignedTo: 'Assigned To',
  status: 'Status',
};

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
  const [sortColumn, setSortColumn] = useState<SortColumn>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignedToFilter, setAssignedToFilter] = useState('all');

  function getSortValue(workItem: WorkItem, column: SortColumn): number | string {
    switch (column) {
      case 'id':
        return workItem.id;
      case 'region':
        return regions.find((region) => region.id == workItem.regionId)?.regionName ?? 'UNKNOWN';
      case 'location':
        return routes.find((route) => route.id == workItem.routeId)?.routeName ?? 'UNKNOWN';
      case 'title':
        return workItem.shortDescription;
      case 'workArea':
        return workAreas.find((workArea) => workArea.id == workItem.workAreaId)?.areaName ?? 'UNKNOWN';
      case 'assignedTo':
        return staff.find((member) => member.id == workItem.assignedToId)?.username ?? 'Unassigned';
      case 'status':
        return statuses.find((itemStatus) => itemStatus.id == workItem.statusId)?.statusName ?? 'UNKNOWN';
    }
  }

  function sortBy(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((currentDirection) => (currentDirection === 'ascending' ? 'descending' : 'ascending'));
      return;
    }

    setSortColumn(column);
    setSortDirection('ascending');
  }

  const filteredWorkItems = workItems.filter((workItem) => {
    const matchesStatus = statusFilter === 'all' || String(workItem.statusId) === statusFilter;
    const matchesAssignee = assignedToFilter === 'all' || String(workItem.assignedToId) === assignedToFilter;

    return matchesStatus && matchesAssignee;
  });

  const sortedWorkItems = [...filteredWorkItems].sort((left, right) => {
    const leftValue = getSortValue(left, sortColumn);
    const rightValue = getSortValue(right, sortColumn);
    const comparison =
      typeof leftValue === 'number' && typeof rightValue === 'number'
        ? leftValue - rightValue
        : String(leftValue).localeCompare(String(rightValue));

    return sortDirection === 'ascending' ? comparison : -comparison;
  });

  const totalPages = Math.max(1, Math.ceil(sortedWorkItems.length / rowsPerPage));
  const visiblePage = Math.min(currentPage, totalPages);
  const visibleWorkItems = sortedWorkItems.slice((visiblePage - 1) * rowsPerPage, visiblePage * rowsPerPage);

  function renderSortHeader(column: SortColumn) {
    const isActive = sortColumn === column;
    const indicator = isActive ? (sortDirection === 'ascending' ? ' \u2191' : ' \u2193') : '';

    return (
      <th aria-sort={isActive ? sortDirection : 'none'}>
        <button className="work-item-sort-button" type="button" onClick={() => sortBy(column)}>
          {sortLabels[column]}
          {indicator}
        </button>
      </th>
    );
  }

  function refreshWorkItems() {
    const token = sessionStorage.getItem(authTokenKey);
    if (!token) return;

    authenticatedFetch('/DatabaseRaw/GetWorkItems')
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
      const response = await authenticatedFetch(`/WorkItem/DeleteWorkItem/${workItem.id}`, {
        method: 'DELETE',
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

    const staffResponse = authenticatedFetch('/DatabaseRaw/GetUsers').then((response) => {
      if (!response.ok) throw new Error();

      return response.json();
    });
    staffResponse.then((data) => {
      setStaff(data);
    });

    const statusesResponse = authenticatedFetch('/DatabaseRaw/GetWorkItemStatuses').then((response) => {
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
      <div className="work-item-list-filters">
        <label>
          Status
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All statuses</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.statusName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Assigned To
          <select
            value={assignedToFilter}
            onChange={(event) => {
              setAssignedToFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Everyone</option>
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.username}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="work-item-list-container">
        <table className="work-item-list">
          <thead>
            <tr>
              {renderSortHeader('id')}
              {renderSortHeader('region')}
              {renderSortHeader('location')}
              {renderSortHeader('title')}
              {renderSortHeader('workArea')}
              {renderSortHeader('assignedTo')}
              {renderSortHeader('status')}
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {visibleWorkItems.length > 0 ? (
              visibleWorkItems.map((workItem) => {
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
      </div>
      {sortedWorkItems.length > 0 && (
        <div className="work-item-pagination" aria-label="Work item pagination">
          <button
            className="secondary-button"
            type="button"
            disabled={visiblePage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, totalPages) - 1))}
          >
            Previous
          </button>
          <span>
            Page {visiblePage} of {totalPages}
          </span>
          <button
            className="secondary-button"
            type="button"
            disabled={visiblePage === totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          >
            Next
          </button>
        </div>
      )}
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
