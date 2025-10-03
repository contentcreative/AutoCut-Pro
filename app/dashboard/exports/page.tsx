import { ExportCreateDialog, ExportJobsTable } from "@/components/exports";

export default function ExportsPage() {
  return (
    <main className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Video Exports</h1>
          <p className="text-gray-600 mt-2">
            Create and manage your video exports with multiple formats and options.
          </p>
        </div>
        <ExportCreateDialog />
      </div>
      
      <div className="space-y-6">
        <ExportJobsTable />
      </div>
    </main>
  );
}