"use client";
import { useEffect, useState } from "react";

type PodInfo = {
  hostname: string;
  version: string;
  timestamp: string;
  nodeEnv: string;
};

type HealthStatus = {
  status: string;
  timestamp: string;
};

export default function Home() {
  const [podInfo, setPodInfo] = useState<PodInfo | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch pod info
  useEffect(() => {
    if (!mounted) return;

    fetch("/api/info")
      .then((res) => res.json())
      .then((data) => {
        setPodInfo(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [mounted]);

  // Fetch health status
  useEffect(() => {
    if (!mounted) return;

    const fetchHealth = () => {
      fetch("/api/health")
        .then((res) => res.json())
        .then(setHealthStatus)
        .catch(() =>
          setHealthStatus({
            status: "error",
            timestamp: new Date().toISOString(),
          })
        );
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, [mounted]);

  // Don't render until mounted to prevent hydration issues
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-k8s-blue to-k8s-light-blue flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-k8s-blue to-k8s-light-blue">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-k8s-navy">
              🚀 Next.js on Kubernetes
            </h1>
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 rounded-full ${
                  healthStatus?.status === "healthy"
                    ? "bg-status-success animate-pulse"
                    : "bg-status-error"
                }`}
              ></div>
              <span className="text-lg font-semibold text-k8s-navy">
                {healthStatus?.status === "healthy" ? "Healthy" : "Unhealthy"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pod Health Dashboard */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-k8s-blue mb-8">
          <h2 className="text-3xl font-bold text-k8s-navy mb-8 text-center">
            📊 Pod Health Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pod Status */}
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
              <div
                className={`text-6xl mb-2 ${
                  healthStatus?.status === "healthy"
                    ? "text-status-success"
                    : "text-status-error"
                }`}
              >
                {healthStatus?.status === "healthy" ? "✅" : "❌"}
              </div>
              <div className="text-xl font-bold text-gray-800">Pod Status</div>
              <div
                className={`text-lg font-semibold ${
                  healthStatus?.status === "healthy"
                    ? "text-status-success"
                    : "text-status-error"
                }`}
              >
                {healthStatus?.status === "healthy" ? "Healthy" : "Unhealthy"}
              </div>
            </div>

            {/* Hostname */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
              <div className="text-4xl mb-2">🏷️</div>
              <div className="text-xl font-bold text-gray-800">Hostname</div>
              <code className="text-lg bg-k8s-blue text-white px-3 py-1 rounded font-mono">
                {podInfo?.hostname || "localhost"}
              </code>
            </div>

            {/* Environment */}
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
              <div className="text-4xl mb-2">🌍</div>
              <div className="text-xl font-bold text-gray-800">Environment</div>
              <span
                className={`text-lg px-3 py-1 rounded font-semibold ${
                  podInfo?.nodeEnv === "production"
                    ? "bg-status-success text-white"
                    : "bg-status-warning text-black"
                }`}
              >
                {podInfo?.nodeEnv || "development"}
              </span>
            </div>

            {/* Version */}
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
              <div className="text-4xl mb-2">🏷️</div>
              <div className="text-xl font-bold text-gray-800">Version</div>
              <div className="text-lg text-status-success font-mono font-bold">
                v{podInfo?.version || "1.0.0"}
              </div>
            </div>
          </div>

          {/* Last Health Check */}
          <div className="mt-8 text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              Last Health Check:{" "}
              <span className="font-mono font-semibold">
                {healthStatus?.timestamp
                  ? new Date(healthStatus.timestamp).toLocaleString()
                  : "Checking..."}
              </span>
            </div>
          </div>
        </div>

        {/* Workshop Instructions */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-k8s-blue">
          <h2 className="text-3xl font-bold text-k8s-navy mb-6 text-center">
            📚 Workshop Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <div className="text-3xl mb-3">1️⃣</div>
              <h3 className="text-xl font-bold text-k8s-blue mb-3">Deploy</h3>
              <code className="text-sm bg-gray-200 p-2 rounded block">
                kubectl apply -f deployment.yaml
              </code>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <div className="text-3xl mb-3">2️⃣</div>
              <h3 className="text-xl font-bold text-k8s-blue mb-3">Expose</h3>
              <code className="text-sm bg-gray-200 p-2 rounded block">
                kubectl apply -f service.yaml
              </code>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <div className="text-3xl mb-3">3️⃣</div>
              <h3 className="text-xl font-bold text-k8s-blue mb-3">Scale</h3>
              <code className="text-sm bg-gray-200 p-2 rounded block">
                kubectl apply -f hpa.yaml
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
