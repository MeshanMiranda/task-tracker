import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ConfirmationModal from './ConfirmationModal';

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', // Extract just the date part if necessary
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'TODO',
        dueDate: '',
      });
    }
  }, [task, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    const submitData = { ...data };
    if (!submitData.dueDate) {
      submitData.dueDate = null;
    }
    setPendingData(submitData);
    setConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    onSave(pendingData);
    setConfirmOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl transition-all duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{task ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.getElementById('task-description')?.focus();
                }
              }}
              className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="Task Title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
            <textarea
              id="task-description"
              {...register('description')}
              rows={3}
              className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="Task Description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
            <select
              {...register('status')}
              className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Due Date</label>
            <input
              type="text"
              placeholder="yyyy-mm-dd"
              onFocus={(e) => (e.target.type = 'date')}
              {...register('dueDate', {
                onBlur: (e) => (e.target.type = 'text')
              })}
              className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title={task ? 'Confirm Update' : 'Confirm Save'}
        message={task ? 'Are you sure you want to update this task?' : 'Are you sure you want to save this new task?'}
        confirmText={task ? 'Update' : 'Save'}
      />
    </div>
  );
};

export default TaskModal;
