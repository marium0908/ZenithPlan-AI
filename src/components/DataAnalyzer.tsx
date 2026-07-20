import React, { useState } from "react";
import { Sparkles, BarChart3, FileUp, Activity, CheckCircle, RefreshCw, FileText, Heart, Shield, HelpCircle } from "lucide-react";
import { getChatResponse } from "../lib/gemini";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

interface DataAnalyzerProps {
  userLoggedIn: boolean;
  onOpenAuth: () => void;
}

const presetBudgetJSON = `[
  {"category": "Transport (Flights)", "amount": 850, "isGreen": false},
  {"category": "Eco-Lodging (Solar Hotel)", "amount": 620, "isGreen": true},
  {"category": "Organic Food & Dining", "amount": 280, "isGreen": true},
  {"category": "Local Guides (Heritage)", "amount": 150, "isGreen": true},
  {"category": "Eco-Canopy Activities", "amount": 200, "isGreen": true}
]`;

export function DataAnalyzer({ userLoggedIn, onOpenAuth }: DataAnalyzerProps) {
  const [dataText, setDataText] = useState(presetBudgetJSON);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<string>("");
  const [chartData, setChartData] = useState<{ name: string; value: number; isGreen: boolean }[]>([]);
  const [esgScore, setEsgScore] = useState<number | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisReport("");

    try {
      // Validate and parse JSON
      const parsed = JSON.parse(dataText);
      if (!Array.isArray(parsed)) {
        throw new Error("Input data must be a JSON array of category & amount records.");
      }

      // Update Chart local state
      const updatedChart = parsed.map((item: any) => ({
        name: item.category || "Item",
        value: Number(item.amount || 0),
        isGreen: !!item.isGreen
      }));
      setChartData(updatedChart);

      // Simple local logic to estimate green ratio
      const totalCost = updatedChart.reduce((acc, curr) => acc + curr.value, 0);
      const greenCost = updatedChart.filter(c => c.isGreen).reduce((acc, curr) => acc + curr.value, 0);
      const greenRatio = totalCost > 0 ? (greenCost / totalCost) * 100 : 0;
      setEsgScore(Math.round(greenRatio));

      // Invoke Gemini agent for deep reasoning about carbon mitigation and local economic multipliers
      const prompt = `You are a professional ESG Sustainability Officer and Green Budget auditor.
Analyze the following travel cost breakdown data (JSON format):
${JSON.stringify(parsed, null, 2)}

Please generate a professional, polished ESG & Carbon Audit Report:
1. **Financial Overview**: Calculate total expenditure, green (sustainable) spending, and brown (non-sustainable/fossil) spending. Give the exact percentage ratio.
2. **Carbon Mitigation Impact**: Discuss the emissions implied by the travel choices (specifically evaluating transport and lodging).
3. **Actionable Mitigation Recommendations**: Suggest 3 explicit, cost-effective swaps to offset the carbon footprint or increase local community support.
4. **Final Sustainability Grade**: Give a letter grade (A+ to F) with a brief justification.
`;

      const aiResponse = await getChatResponse([{ role: "user", content: prompt }], "ESG Budget Auditor");
      setAnalysisReport(aiResponse || "Error processing data analysis.");
    } catch (err: any) {
      console.error(err);
      setAnalysisReport(`Analysis failed: ${err.message}. Please verify that you entered valid JSON format containing "category", "amount", and "isGreen" parameters.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const COLORS = ["#10B981", "#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6"];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
          <span>Carbon Footprint Auditor</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          AI Budget & Carbon footprint Auditor
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
          Upload or paste your estimated travel expense breakdown. Our AI financial agent audits your expenditures, determines your localized economic multiplier, and rates your ESG score.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input panel */}
        <form onSubmit={handleAnalyze} className="lg:col-span-5 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Auditor Data Console (JSON Array)
              </label>
              <button
                type="button"
                onClick={() => setDataText(presetBudgetJSON)}
                className="text-[10px] text-emerald-600 font-bold hover:underline"
              >
                Reset to Preset
              </button>
            </div>
            <textarea
              required
              rows={9}
              value={dataText}
              onChange={(e) => setDataText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-4 text-xs font-mono text-slate-800 shadow-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Auditing ESG Metrics...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Audit Carbon & Finances</span>
              </>
            )}
          </button>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <FileUp className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div className="text-xs space-y-1 text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-700 block">How does this work?</span>
              The auditor calculates the ratio of <strong className="text-emerald-600">Green spending</strong> (e.g. eco-certified lodging, community guides) to <strong className="text-blue-500">Brown spending</strong> (e.g. commercial fuel transit).
            </div>
          </div>
        </form>

        {/* Results / Charts panel */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {analysisReport ? (
            <div className="space-y-6">
              {/* Top summary row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] text-emerald-700 font-black uppercase tracking-wider block">ESG Rating Score</span>
                  <span className="text-3xl font-black text-emerald-800">{esgScore}%</span>
                  <span className="text-[9px] text-emerald-600 block font-bold">Eco-Aligned Cost Ratio</span>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] text-blue-700 font-black uppercase tracking-wider block">Carbon Estimate</span>
                  <span className="text-3xl font-black text-blue-800">
                    {Math.round(chartData.reduce((acc, c) => acc + (c.isGreen ? c.value * 0.05 : c.value * 0.35), 0))} kg
                  </span>
                  <span className="text-[9px] text-blue-600 block font-bold">CO2e Footprint</span>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl text-center col-span-2 md:col-span-1 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">Total Budget Audited</span>
                  <span className="text-2xl font-black text-slate-800">
                    ${chartData.reduce((acc, c) => acc + c.value, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Chart & Text Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl h-64 flex flex-col justify-between shadow-sm">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block text-center mb-2">
                    Expenditure Allocation
                  </span>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center text-[9px] font-bold text-slate-600">
                    {chartData.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Text Report */}
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 overflow-y-auto max-h-[256px] text-xs space-y-3 font-medium leading-relaxed">
                  <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-2 mb-2 font-black text-[10px] uppercase tracking-wider">
                    <Activity className="w-4 h-4" />
                    <span>Audit Analysis Report</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-slate-300">
                    {analysisReport}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/20">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 animate-pulse">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Ready for Audit</h3>
              <p className="text-slate-400 text-sm max-w-sm mt-1">
                Enter your carbon and budget cost items. The agent will parse categories, plot custom charts, and calculate your localized impact metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
