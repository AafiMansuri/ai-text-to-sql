import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

  type QueryResult = {
    columns: string[]
    rows: Record<string, string | number | null>[]
  }

const QueryResultTable = ({ query_result }: { query_result: QueryResult }) => {
    const { columns, rows } = query_result

  return (
    <div className="overflow-x-auto mt-2">
      <Table className="table-auto border border-zinc-400 dark:border-zinc-600">
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead className="border border-zinc-400 dark:border-zinc-600 px-4 py-2" key={`${col}-${index}`}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col, cellIndex) => (
                <TableCell key={`cell-${rowIndex}-${cellIndex}`} className="border border-zinc-400 dark:border-zinc-600 px-4 py-2">
                  {(() => {
                    const cell = (row as any)[col]
                    if (typeof cell === "string" && cell.endsWith("Z")) {
                      return new Date(cell).toLocaleString()
                    }
                    return cell ?? "—"
                  })()}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default QueryResultTable