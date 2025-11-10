import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { salesOrderService } from '@/services/api/salesOrderService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const SalesOrders = () => {
  const { openSalesOrderModal } = useOutletContext();
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('order_date_c');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadSalesOrders();
  }, []);

  const loadSalesOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await salesOrderService.getAll();
      setSalesOrders(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load sales orders');
      setSalesOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (salesOrder) => {
    openSalesOrderModal(salesOrder);
  };

  const handleCreate = () => {
    openSalesOrderModal();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this sales order?')) return;
    
    try {
      await salesOrderService.delete(id);
      toast.success('Sales order deleted successfully');
      loadSalesOrders();
    } catch (error) {
      toast.error('Failed to delete sales order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Confirmed': 'bg-blue-100 text-blue-800', 
      'Shipped': 'bg-yellow-100 text-yellow-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredAndSortedOrders = salesOrders
    .filter(order => filter === 'All' || order.status_c === filter)
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'total_amount_c') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const handleRetry = () => {
    loadSalesOrders();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={handleRetry} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={20} />
          Add Sales Order
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-2">
          {['All', 'Draft', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="order_date_c">Order Date</option>
            <option value="name_c">Name</option>
            <option value="total_amount_c">Total Amount</option>
            <option value="status_c">Status</option>
          </select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <ApperIcon name={sortOrder === 'asc' ? "ArrowUp" : "ArrowDown"} size={16} />
          </Button>
        </div>
      </div>

      {filteredAndSortedOrders.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="ShoppingCart" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sales orders found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first sales order.</p>
          <Button onClick={handleCreate}>
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Add Sales Order
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedOrders.map((order, index) => (
            <motion.div
              key={order.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {order.name_c || `Order #${order.Id}`}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Order Date: {order.order_date_c ? new Date(order.order_date_c).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status_c)}>
                  {order.status_c || 'Draft'}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Contact:</span>
                  <span className="text-sm font-medium">
                    {order.contact_id_c?.Name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Deal:</span>
                  <span className="text-sm font-medium">
                    {order.deal_id_c?.Name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Quote:</span>
                  <span className="text-sm font-medium">
                    {order.quote_id_c?.Name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Amount:</span>
                  <span className="text-sm font-semibold text-green-600">
                    ${order.total_amount_c ? parseFloat(order.total_amount_c).toLocaleString() : '0.00'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(order)}
                  className="flex-1"
                >
                  <ApperIcon name="Edit" size={16} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(order.Id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesOrders;