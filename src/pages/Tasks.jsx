import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import TaskModal from '../components/TaskModal';

const ITEMS_PER_PAGE = 3;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskAPI.getAll(page, ITEMS_PER_PAGE);
      const data = res.data;
      setTasks(data.tasks || data.data || []);
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / ITEMS_PER_PAGE) || 1);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    }
    setOpenMenu(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
    setOpenMenu(null);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleModalSave = async (formData) => {
    try {
      if (editingTask) {
        await taskAPI.update(editingTask._id, formData);
        toast.success('Task updated');
      } else {
        await taskAPI.create(formData);
        toast.success('Task added');
      }
      handleModalClose();
      fetchTasks();
    } catch {
      toast.error('Failed to save task');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const statusBadge = (status) => {
    const styles = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles['pending']}`}>
        {status || 'pending'}
      </span>
    );
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="h-screen bg-bg-dark flex flex-col overflow-hidden">
      {/* Main card */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full bg-bg-card p-6 md:p-10 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">
              <span className="text-primary">Tasks</span>{' '}
              <span className="text-primary-light">Management</span>
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary-light transition cursor-pointer"
              >
                <FiPlus className="text-lg" />
                Add Task
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-full text-sm font-medium text-gray-500 border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No tasks yet. Click "+ Add Task" to create one.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-primary text-sm border-b border-gray-200">
                      <th className="pb-3 pl-4 w-16">No</th>
                      <th className="pb-3 w-48">Title</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3 w-36">Status</th>
                      <th className="pb-3 pr-4 text-right w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, idx) => (
                      <tr key={task._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-5 pl-4 text-gray-600">{(page - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                        <td className="py-5 text-gray-800 font-medium">{task.title}</td>
                        <td className="py-5 text-gray-500 text-sm truncate max-w-xs">{task.description}</td>
                        <td className="py-5">{statusBadge(task.status)}</td>
                        <td className="py-5 pr-4 text-right relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === task._id ? null : task._id)}
                            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                          >
                            <BsThreeDotsVertical />
                          </button>
                          {openMenu === task._id && (
                            <div className="absolute right-4 top-12 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[120px]">
                              <button
                                onClick={() => handleEdit(task)}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                              >
                                <span className="text-primary">✓</span> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(task._id)}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {tasks.map((task) => (
                  <div key={task._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <h3 className="font-semibold text-gray-800">{task.title}</h3>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{task.description}</p>
                        <div className="mt-2">{statusBadge(task.status)}</div>
                      </div>
                      <button
                        onClick={() => setOpenMenu(openMenu === task._id ? null : task._id)}
                        className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      >
                        <BsThreeDotsVertical />
                      </button>
                    </div>
                    {openMenu === task._id && (
                      <div className="absolute right-4 top-10 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[120px]">
                        <button
                          onClick={() => handleEdit(task)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                        >
                          <span className="text-primary">✓</span> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <FiChevronLeft />
                </button>

                {/* Desktop page numbers */}
                <div className="hidden md:flex items-center gap-1">
                  {pageNumbers.map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer ${
                        page === num
                          ? 'bg-primary text-white'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <FiChevronRight />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Tasks;
