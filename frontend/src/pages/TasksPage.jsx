import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import userService from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import TaskModal from '../components/TaskModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { toast } from 'react-toastify';

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('dueDate,asc');
  const [viewMode, setViewMode] = useState('grid');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10, // Items per page
        sort: sortOrder
      };
      if (statusFilter) params.status = statusFilter;
      if (ownerFilter && user?.role === 'ADMIN') params.ownerId = ownerFilter;

      const data = await taskService.getTasks(params);
      setTasks(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (user?.role === 'ADMIN') {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (error) {
        toast.error('Failed to load users');
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter, ownerFilter, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData);
        toast.success('Task updated successfully');
      } else {
        await taskService.createTask(taskData);
        toast.success('Task created successfully');
      }
      handleCloseModal();
      fetchTasks();
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const confirmDelete = (id) => {
    setTaskToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await taskService.deleteTask(taskToDelete);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DONE': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 py-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Tasks</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Create Task
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="block w-full rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border py-2 px-3 transition-colors duration-200"
            >
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          
          {user?.role === 'ADMIN' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Owner</label>
              <select
                value={ownerFilter}
                onChange={(e) => { setOwnerFilter(e.target.value); setPage(0); }}
                className="block w-full rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border py-2 px-3 transition-colors duration-200"
              >
                <option value="">All Owners</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Sort By</label>
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); setPage(0); }}
              className="block w-full rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border py-2 px-3 transition-colors duration-200"
            >
              <option value="dueDate,asc">Due Date (Ascending)</option>
              <option value="dueDate,desc">Due Date (Descending)</option>
              <option value="status,asc">Status</option>
              <option value="createdAt,desc">Created Date (Newest)</option>
            </select>
          </div>
        </div>
        
        <div className="flex-shrink-0 mt-4 md:mt-0">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">View</label>
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col space-y-3"}>
            {viewMode === 'list' && tasks.length > 0 && (
              <div className="flex items-center p-4 gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <div className="w-1/4 min-w-0">Title</div>
                <div className="w-1/4 min-w-0">Description</div>
                <div className="w-24 flex-shrink-0">Status</div>
                {user?.role === 'ADMIN' && <div className="w-32 flex-shrink-0">Owner</div>}
                <div className="w-28 flex-shrink-0">Due Date</div>
                <div className="flex-grow text-right pr-2">Actions</div>
              </div>
            )}
            {tasks.map(task => (
              viewMode === 'grid' ? (
                <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full relative group">
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">{task.title}</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(task)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                          title="Edit Task"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                        <button
                          onClick={() => confirmDelete(task.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                          title="Delete Task"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 min-h-[4rem]">{task.description}</p>
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mt-auto">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span className="truncate">Due: <span className={new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'text-red-500 font-semibold ml-1' : 'ml-1'}>{task.dueDate || 'No date set'}</span></span>
                      </div>
                      {user?.role === 'ADMIN' && (
                         <div className="flex items-center">
                           <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                           <span className="truncate">Owner: <span className="ml-1 font-medium">{task.owner?.name}</span></span>
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-300 overflow-hidden">
                  <div className="flex items-center p-4 gap-4">
                    <div className="w-1/4 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate" title={task.title}>{task.title}</h3>
                    </div>
                    <div className="w-1/4 min-w-0">
                      <p className="text-gray-600 dark:text-gray-300 text-sm truncate" title={task.description}>{task.description}</p>
                    </div>
                    <div className="w-24 flex-shrink-0 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    {user?.role === 'ADMIN' && (
                      <div className="w-32 flex-shrink-0 flex items-center text-sm text-gray-500 dark:text-gray-400 min-w-0">
                        <span className="truncate" title={task.owner?.name}>{task.owner?.name}</span>
                      </div>
                    )}
                    <div className="w-28 flex-shrink-0 flex items-center text-sm text-gray-500 dark:text-gray-400 min-w-0">
                      <span className={`truncate ${new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'text-red-500 font-semibold' : ''}`}>{task.dueDate || 'No date set'}</span>
                    </div>
                    <div className="flex-grow flex items-center justify-end space-x-4 pr-2">
                      <button
                        onClick={() => handleOpenModal(task)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                        title="Edit Task"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button
                        onClick={() => confirmDelete(task.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete Task"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
            {tasks.length === 0 && (
               <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                 <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                 <p className="text-lg">No tasks found.</p>
                 <p className="text-sm mt-1">Try adjusting your filters or create a new task.</p>
               </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-200 ${page === 0 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-medium">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-200 ${page === totalPages - 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={editingTask}
      />

      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        confirmColor="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      />
    </div>
  );
};

export default TasksPage;
