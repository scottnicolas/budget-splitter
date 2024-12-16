import React, { useState } from "react";
import { departments } from "../departmentsData";

interface SplitResult {
  department: string;
  amount: number;
}

const BudgetSplitter: React.FC = () => {
  const [total, setTotal] = useState<number>(0);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [results, setResults] = useState<SplitResult[]>([]);

  const handleDepartmentChange = (id: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(id) ? prev.filter((dept) => dept !== id) : [...prev, id]
    );
  };

  const calculateSplit = () => {
    // Weights for each department if all departments are selected
    let departmentWeights: { [key: string]: number } = {
      office: 0.2,
      english: 0.2,
      humanities: 0.2,
      socialSciences: 0.2,
      math: 0.1,
      naturalSciences: 0.1,
    };

    let activeWeights = { ...departmentWeights };
    let totalWeight = 0;

    // Adjust weights based on selected departments
    selectedDepartments.forEach((deptId) => {
      const department = departments.find((d) => d.id === deptId);
      if (deptId === "mathAndNaturalSciences") {
        totalWeight += activeWeights.math + activeWeights.naturalSciences;
      } else if (department) {
        totalWeight += activeWeights[deptId] ?? 0;
      }
    });

    // Calculate each department's split amount based on active weights
    const splitResults: SplitResult[] = selectedDepartments.flatMap(
      (deptId) => {
        const dept = departments.find((d) => d.id === deptId);
        if (deptId === "mathAndNaturalSciences") {
          return [
            {
              department: "Math",
              amount: parseFloat(
                (total * (activeWeights.math / totalWeight)).toFixed(2)
              ),
            },
            {
              department: "Natural Sciences",
              amount: parseFloat(
                (total * (activeWeights.naturalSciences / totalWeight)).toFixed(
                  2
                )
              ),
            },
          ];
        } else if (dept) {
          return [
            {
              department: dept.name,
              amount: parseFloat(
                (total * (activeWeights[deptId] / totalWeight)).toFixed(2)
              ),
            },
          ];
        } else {
          return [];
        }
      }
    );

    setResults(splitResults);
  };

  return (
    <div className="max-w-lg mx-auto mt-2 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Budget Splitter
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Total Amount:
        </label>
        <input
          type="number"
          value={total}
          onChange={(e) => setTotal(parseFloat(e.target.value))}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Select Departments:</h3>
        {departments.map((dept) => (
          <div key={dept.id} className="flex items-center mb-2 ml-2">
            <input
              type="checkbox"
              checked={selectedDepartments.includes(dept.id)}
              onChange={() => handleDepartmentChange(dept.id)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              {dept.name}
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={calculateSplit}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      >
        Calculate
      </button>
      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Split Results:
          </h3>
          <ul className="space-y-2">
            {results.map((result) => (
              <li
                key={result.department}
                className="flex justify-between p-2 border rounded-md bg-gray-100"
              >
                <span className="font-medium">{result.department}:</span>
                <span>${result.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BudgetSplitter;
