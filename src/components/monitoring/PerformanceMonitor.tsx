
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Clock, Database } from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

interface SystemMetrics {
  memoryUsage: number;
  connectionType: string;
  loadTime: number;
  cacheHitRate: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    memoryUsage: 0,
    connectionType: 'unknown',
    loadTime: 0,
    cacheHitRate: 0,
  });

  useEffect(() => {
    // Load performance metrics
    const loadMetrics = () => {
      const storedMetrics = JSON.parse(sessionStorage.getItem('performance-metrics') || '[]');
      setMetrics(storedMetrics);
    };

    // Calculate system metrics
    const calculateSystemMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;
      const connection = (navigator as any).connection;

      setSystemMetrics({
        memoryUsage: memory ? Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100) : 0,
        connectionType: connection ? connection.effectiveType : 'unknown',
        loadTime: navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : 0,
        cacheHitRate: Math.round(Math.random() * 100), // Mock data - replace with actual cache stats
      });
    };

    loadMetrics();
    calculateSystemMetrics();

    // Refresh metrics every 30 seconds
    const interval = setInterval(() => {
      loadMetrics();
      calculateSystemMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getPerformanceStatus = (time: number) => {
    if (time < 50) return { status: 'Excellent', color: 'bg-green-500' };
    if (time < 100) return { status: 'Good', color: 'bg-yellow-500' };
    return { status: 'Needs Improvement', color: 'bg-red-500' };
  };

  const averageRenderTime = metrics.length > 0 
    ? Math.round(metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length)
    : 0;

  const slowestComponents = metrics
    .sort((a, b) => b.renderTime - a.renderTime)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Render Time
                </p>
                <p className="text-2xl font-bold">{averageRenderTime}ms</p>
                <Badge className={getPerformanceStatus(averageRenderTime).color}>
                  {getPerformanceStatus(averageRenderTime).status}
                </Badge>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Memory Usage
                </p>
                <p className="text-2xl font-bold">{systemMetrics.memoryUsage}%</p>
                <Progress value={systemMetrics.memoryUsage} className="mt-2" />
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Load Time
                </p>
                <p className="text-2xl font-bold">{systemMetrics.loadTime}ms</p>
                <p className="text-sm text-gray-500">{systemMetrics.connectionType}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Cache Hit Rate
                </p>
                <p className="text-2xl font-bold">{systemMetrics.cacheHitRate}%</p>
                <Progress value={systemMetrics.cacheHitRate} className="mt-2" />
              </div>
              <Database className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Slowest Components
          </CardTitle>
        </CardHeader>
        <CardContent>
          {slowestComponents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No performance data available yet
            </p>
          ) : (
            <div className="space-y-4">
              {slowestComponents.map((metric, index) => (
                <div
                  key={`${metric.componentName}-${metric.timestamp}`}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{metric.componentName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(metric.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{metric.renderTime}ms</p>
                    <Badge className={getPerformanceStatus(metric.renderTime).color}>
                      {getPerformanceStatus(metric.renderTime).status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;
