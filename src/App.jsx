import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function App() {
  const [explist, updlist] = useState(() => {
    const data = localStorage.getItem("expenses");
    return data ? JSON.parse(data) : [];
  });

  const [name, updname] = useState("");
  const [amt, updamt] = useState("");
  const [date, upddate] = useState("");
  const [category, updcategory] = useState("Food");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(explist));
  }, [explist]);

  const namefunc = (e) => updname(e.target.value);
  const amtfunc = (e) => updamt(e.target.value);
  const datefunc = (e) => upddate(e.target.value);
  const catfunc = (e) => updcategory(e.target.value);
  const searchFunc = (e) => setSearchTerm(e.target.value);

  const savefunc = (e) => {
    e.preventDefault();
    const obj = { name, amt, date, category, opcl: false };
    updlist((prev) => [...prev, obj]);
    updname("");
    updamt("");
    upddate("");
    updcategory("Food");
  };

  const savefunc1 = (e, index) => {
    e.preventDefault();
    const updatedList = explist.map((val, ind) => {
      if (ind === index) {
        return { ...val, name, amt, date, category, opcl: false };
      }
      return val;
    });
    updlist(updatedList);
    updname("");
    updamt("");
    upddate("");
    updcategory("Food");
  };

  const updexplist = (id) => {
    const filt = explist.filter((_, ind) => ind !== id);
    updlist(filt);
  };

  const reexplist = (id) => {
    const item = explist[id];
    updname(item.name);
    updamt(item.amt);
    upddate(item.date);
    updcategory(item.category);
    const updatedList = explist.map((val, ind) =>
      ind === id ? { ...val, opcl: true } : val
    );
    updlist(updatedList);
  };

  const totalAmount = explist.reduce((sum, curr) => sum + Number(curr.amt), 0);

  const filteredList = explist.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.amt.toString().includes(searchTerm) ||
      item.date.includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryData = Object.entries(
    explist.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amt);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="container-fluid min-vh-100 min-vw-100 bg-light py-4">
      <h1 className="text-center mb-4 display-5 fw-bold">Expense Tracker</h1>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">💲 Monthly Summary</h5>
              <p className="card-text h4 text-success">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">📊 Category Breakdown</h5>
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      label
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Add New Expense</h5>
          <form onSubmit={savefunc} className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={name}
                onChange={namefunc}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="number"
                className="form-control"
                placeholder="Amount"
                value={amt}
                onChange={amtfunc}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={datefunc}
                required
              />
            </div>
            <div className="col-md-6">
              <select className="form-select" value={category} onChange={catfunc} required>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-70">
                ⊕ Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Expense History */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Expense History</h5>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by Title, Amount, Date or Category"
            value={searchTerm}
            onChange={searchFunc}
          />

          <ul className="list-group">
            {filteredList.map((val, ind) => (
              <li
                key={ind}
                className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
              >
                {val.opcl ? (
                  <form onSubmit={(e) => savefunc1(e, ind)} className="row w-100 g-2">
                    <div className="col-md-3">
                      <input type="text" value={name} onChange={namefunc} className="form-control" />
                    </div>
                    <div className="col-md-2">
                      <input type="number" value={amt} onChange={amtfunc} className="form-control" />
                    </div>
                    <div className="col-md-3">
                      <input type="date" value={date} onChange={datefunc} className="form-control" />
                    </div>
                    <div className="col-md-2">
                      <select className="form-select" value={category} onChange={catfunc}>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <button type="submit" className="btn btn-success w-100">Update</button>
                    </div>
                  </form>
                ) : (
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                      <strong>{val.name}</strong>
                      <div className="text-muted small">{val.category}</div>
                      <div className="text-muted small">{val.date}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold text-primary">${val.amt}</span>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => reexplist(ind)}>✏️</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => updexplist(ind)}>🗑️</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
            {filteredList.length === 0 && (
              <li className="list-group-item text-center text-muted">No matching records found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

