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
      case 'TODO': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DONE': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tasks</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Create Task
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border py-2 px-3 transition-colors duration-200"
            >
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          
          {user?.role === 'ADMIN' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
              <select
                value={ownerFilter}
                onChange={(e) => { setOwnerFilter(e.target.value); setPage(0); }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border py-2 px-3 transition-colors duration-200"
              >
                <option value="">All Owners</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); setPage(0); }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border py-2 px-3 transition-colors duration-200"
            >
              <option value="dueDate,asc">Due Date (Ascending)</option>
              <option value="dueDate,desc">Due Date (Descending)</option>
              <option value="status,asc">Status</option>
              <option value="createdAt,desc">Created Date (Newest)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <div key={task.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 truncate pr-4">{task.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[4rem]">{task.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Due: <span className={new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'text-red-500 font-semibold ml-1' : 'ml-1'}>{task.dueDate || 'No date set'}</span>
                    </div>
                    {user?.role === 'ADMIN' && (
                       <div className="flex items-center">
                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                         Owner: <span className="ml-1 font-medium">{task.owner?.name}</span>
                       </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end space-x-3">
                  <button
                    onClick={() => handleOpenModal(task)}
                    className="text-indigo-600 hover:text-indigo-900 font-medium text-sm transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(task.id)}
                    className="text-red-600 hover:text-red-900 font-medium text-sm transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
               <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                 <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
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
                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-200 ${page === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 bg-white px-4 py-2 border border-gray-300 rounded-md font-medium">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-200 ${page === totalPages - 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
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
