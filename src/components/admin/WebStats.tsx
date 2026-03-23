"use client";

import api from "@/lib/axios";
import { getApiErrorMessage } from "@/services/GetApiErrMessage";
import { ApiResponse } from "@/types/commons/apiResponse";
import React, { useEffect, useMemo, useState } from "react";
import HeaderSection from "../commons/HeaderSection";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Building, Calendar, Image, Newspaper, UserCheck } from "lucide-react";

type TimeStampAnalytic = {
  timestamp: string;
  count: number;
};

type analyticData = {
  VisitorCount: number;
  NewsCount: number;
  DepartmentCount: number;
  ActiveProgendaCount: number;
  ActiveMonthlyEventCount: number;
  ActiveAnggotaCount: number;
  ActiveGalleryCount: number;
  NewVisitorsGraph: TimeStampAnalytic[];
};

function padGraphData(raw: TimeStampAnalytic[]): TimeStampAnalytic[] {
  if (!raw || raw.length === 0) return [];
  const sorted = [...raw].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const countMap = new Map<string, number>();
  for (const item of sorted) {
    const key = new Date(item.timestamp).toISOString();
    countMap.set(key, (countMap.get(key) ?? 0) + item.count);
  }
  const start = new Date(sorted[0].timestamp);
  start.setMinutes(0, 0, 0);
  const end = new Date(sorted[sorted.length - 1].timestamp);
  end.setMinutes(0, 0, 0);
  const result: TimeStampAnalytic[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const key = cursor.toISOString();
    result.push({ timestamp: key, count: countMap.get(key) ?? 0 });
    cursor.setHours(cursor.getHours() + 1);
  }
  return result;
}

function WebStats() {
  const [data, setData] = useState<analyticData | null>(null);

  useEffect(() => {
    const fetchAnalytic = async () => {
      try {
        const json = await api.get<ApiResponse<analyticData>>(`/analytics`);
        setData(json.data.data);
      } catch (err) {
        console.error(`Api Err: ${getApiErrorMessage(err)}`);
      }
    };

    fetchAnalytic();
  }, []);

  const paddedGraph = useMemo(
    () => padGraphData(data?.NewVisitorsGraph ?? []),
    [data?.NewVisitorsGraph],
  );

  const yMax = useMemo(() => {
    if (paddedGraph.length === 0) return 5;
    const peak = Math.max(...paddedGraph.map((p) => p.count));
    return Math.max(Math.ceil(peak * 1.2), peak + 1);
  }, [paddedGraph]);

  return (
    <div className="w-full flex flex-col gap-8 mt-6">
      <HeaderSection
        title={"Website Analytics"}
        titleStyle="font-inter text-center"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-[-50px] right-[-50px]" />

        <div className="bg-white p-6 rounded-3xl shadow-lg ring-1 ring-gray-200 text-center lg:h-[290px] flex items-center justify-center flex-col">
          <p className="text-gray-600 text-xl tracking-widest">
            TOTAL VISITORS
          </p>

          <h1 className="text-7xl font-bold mt-2 text-[#D58A94]">
            {data?.VisitorCount ?? "-"}
          </h1>
        </div>

        {/* Graph */}
        <div className="bg-white p-6 rounded-3xl shadow-lg ring-1 ring-gray-200">
          <p className="text-gray-600 text-sm mb-4">Visitor Growth</p>

          <div className="max-lg:overflow-x-auto">
            <div className="min-w-[600px] h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paddedGraph}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => {
                      const d = new Date(value);
                      return `${d.getDate()} ${d.toLocaleString("id-ID", { month: "short" })} ${d.getHours().toString().padStart(2, "0")}:00`;
                    }}
                    minTickGap={30}
                  />

                  <YAxis domain={[0, yMax]} allowDecimals={false} />

                  <Tooltip
                    labelFormatter={(v) => new Date(v).toLocaleString("id-ID")}
                  />

                  <Line
                    type="stepAfter"
                    dataKey="count"
                    stroke="#22C55E"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="News" value={data?.NewsCount} icon={<Newspaper />} />

        <StatCard
          label="Departments"
          value={data?.DepartmentCount}
          icon={<Building />}
        />

        <StatCard
          label="Progenda"
          value={data?.ActiveProgendaCount}
          icon={<Calendar />}
        />

        <StatCard
          label="Monthly Events"
          value={data?.ActiveMonthlyEventCount}
          icon={<Calendar />}
        />

        <StatCard
          label="Members"
          value={data?.ActiveAnggotaCount}
          icon={<UserCheck />}
        />

        <StatCard
          label="Gallery"
          value={data?.ActiveGalleryCount}
          icon={<Image />}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value?: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 bg-white/70 backdrop-blur-lg shadow-lg ring-1 ring-gray-200 hover:scale-[1.02] transition">
      <div className="absolute w-32 h-32 bg-[#D58A94]/20 rounded-full blur-2xl -top-10 -right-10" />

      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{label}</p>

        <div className="text-[#D58A94]">{icon}</div>
      </div>

      <h2 className="text-4xl font-bold mt-3 text-gray-800">{value ?? "-"}</h2>
    </div>
  );
}

export default WebStats;
