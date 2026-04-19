import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { createItem, deleteItem, getItems, updateItem } from './api';
import { Item, ItemForm } from './types';

const initialForm: ItemForm = {
  name: '',
  length: 0,
  width: 0,
  thickness: 0,
  type: '',
  price: 0,
  quantity: 0
};

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<ItemForm>(initialForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data);
    } catch (error) {
      setMessage('Unable to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setSelectedId(null);
    setMessage('');
  };

  const handleChange = (field: keyof ItemForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'name' || field === 'type' ? value : Number(value)
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      if (selectedId) {
        await updateItem(selectedId, form);
        setMessage('Item updated successfully.');
      } else {
        await createItem(form);
        setMessage('Item added to inventory.');
      }
      resetForm();
      loadItems();
    } catch (error) {
      setMessage('Unable to save item. Please validate all fields.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: Item) => {
    setSelectedId(item._id);
    setForm({
      name: item.name,
      length: item.length,
      width: item.width,
      thickness: item.thickness,
      type: item.type,
      price: item.price,
      quantity: item.quantity
    });
    setMessage('Editing item. Update fields and submit.');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this plywood item?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteItem(id);
      setMessage('Item removed from inventory.');
      loadItems();
    } catch (error) {
      setMessage('Unable to delete item.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const rows = items.map((item) => ({
      Name: item.name,
      Length: item.length,
      Width: item.width,
      Thickness: item.thickness,
      Type: item.type,
      Price: item.price,
      Quantity: item.quantity,
      Status: item.quantity < 5 ? 'LOW STOCK' : 'OK'
    }));

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Inventory');
    XLSX.writeFile(workbook, 'plywood-inventory-report.xlsx');
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Plywood Inventory Management</h1>
          <p>Manage inventory, update quantities, and download daily reports.</p>
        </div>
        <button className="primary" onClick={downloadReport} disabled={items.length === 0}>
          Download Report
        </button>
      </div>

      <div className="card">
        <h2>{selectedId ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Length"
              value={form.length}
              onChange={(e) => handleChange('length', e.target.value)}
              min={0}
              required
            />
            <input
              type="number"
              placeholder="Width"
              value={form.width}
              onChange={(e) => handleChange('width', e.target.value)}
              min={0}
              required
            />
            <input
              type="number"
              placeholder="Thickness"
              value={form.thickness}
              onChange={(e) => handleChange('thickness', e.target.value)}
              min={0}
              required
            />
            <input
              placeholder="Shape / Type"
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              min={0}
              step="0.01"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              min={0}
              required
            />
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <button className="primary" type="submit" disabled={loading}>
              {selectedId ? 'Update Item' : 'Add Item'}
            </button>
            <button className="secondary" type="button" onClick={resetForm}>
              Clear
            </button>
          </div>
        </form>
        {message && <p className="status">{message}</p>}
      </div>

      <div className="card">
        <div className="report-row">
          <h2>Inventory</h2>
          <span>{loading ? 'Loading...' : `${items.length} items`}</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Length</th>
                <th>Width</th>
                <th>Thickness</th>
                <th>Type</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className={item.quantity < 5 ? 'low-stock' : ''}>
                  <td>{item.name}</td>
                  <td>{item.length}</td>
                  <td>{item.width}</td>
                  <td>{item.thickness}</td>
                  <td>{item.type}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>
                    {item.quantity < 5 ? <span className="badge low">LOW STOCK</span> : 'OK'}
                  </td>
                  <td className="actions">
                    <button className="secondary" type="button" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    <button className="danger" type="button" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={9}>No items found. Add your first plywood entry.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
