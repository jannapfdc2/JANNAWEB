import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function SupabaseTest() {
  const [status, setStatus] = useState("Checking connection...");
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  async function testSupabaseConnection() {
    const { data, error } = await supabase
      .from("projects")
      .select("*");

    if (error) {
      console.error("Supabase connection error:", error);
      setStatus("❌ Supabase connection failed: " + error.message);
      return;
    }

    console.log("Supabase connected. Data:", data);
    setProjects(data || []);
    setStatus("✅ Supabase is connected successfully!");
  }

  return (
    <div className="p-6 border border-slate-200 rounded-lg mt-4 bg-white">
      <h1 className="text-xl font-bold text-slate-800">Supabase Connection Test</h1>
      <p className="text-slate-600 mt-2">{status}</p>

      <h2 className="text-lg font-semibold mt-4 text-slate-800">Projects Data:</h2>

      <div className="mt-2 text-slate-600">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <ul className="list-disc pl-5">
            {projects.map((project) => (
              <li key={project.id}>
                {project.name} - {project.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
