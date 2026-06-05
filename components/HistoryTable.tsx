"use client";

interface HistoryItem {
  id: string;
  fileName: string;
  pages: number;
  createdAt: number;
  pdfUrl?: string;
}

interface Props {
  history: HistoryItem[];
}

export default function HistoryTable({
  history,
}: Props) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">
        Conversion History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl overflow-hidden">
          <thead>
            <tr className="border-b bg-muted">
              <th className="p-4 text-left">
                File
              </th>

              <th className="p-4 text-left">
                Pages
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Download
              </th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-muted-foreground"
                >
                  No conversions yet
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-muted/50"
                >
                  <td className="p-4">
                    {item.fileName}
                  </td>

                  <td className="p-4">
                    {item.pages}
                  </td>

                  <td className="p-4">
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    {item.pdfUrl ? (
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex
                          items-center
                          bg-indigo-600
                          hover:bg-indigo-700
                          text-white
                          px-4
                          py-2
                          rounded-lg
                          transition
                        "
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400">
                        Not Available
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}