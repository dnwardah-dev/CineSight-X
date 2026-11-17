<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@page { margin: 30px; }
body {
    font-family: DejaVu Sans, sans-serif;
    font-size: 9px;
    color: #192b3e;
}
.header {
    background: #0b1726;
    color: white;
    padding: 22px;
    margin-bottom: 16px;
}
.brand {
    color: #35dfc5;
    font-weight: bold;
    font-size: 12px;
    letter-spacing: 2px;
}
h1 { font-size: 22px; margin: 10px 0 5px; }
.meta {
    padding: 12px;
    background: #edf3f7;
    margin-bottom: 16px;
    line-height: 1.8;
}
table { width: 100%; border-collapse: collapse; }
thead { display: table-header-group; }
th {
    background: #163247;
    color: white;
    padding: 9px 6px;
    text-align: left;
}
td {
    padding: 9px 6px;
    border-bottom: 1px solid #dce5eb;
}
tr { page-break-inside: avoid; }
tbody tr:nth-child(even) { background: #f1f5f8; }
.footer { margin-top: 18px; font-size: 8px; color: #6d7d8d; }
</style>
</head>
<body>

<div class="header">
    <div class="brand">CINESIGHT-X</div>
    <h1>Activity History Report</h1>
    <div>Studio 01 | Administrative Audit Trail</div>
</div>

<div class="meta">
    <strong>Generated:</strong>
    {{ $generatedAt->format('d/m/Y H:i:s') }} WIB

    &nbsp; | &nbsp;

    <strong>Records:</strong> {{ $logs->count() }}

    <br>

    <strong>Search:</strong>
    {{ $search !== '' ? $search : 'All records' }}

    &nbsp; | &nbsp;

    <strong>Action:</strong> {{ $action ?? 'All activities' }}
</div>

<table>
<thead>
<tr>
    <th>ID</th>
    <th>Seat</th>
    <th>Action</th>
    <th>Administrator</th>
    <th>Old Status</th>
    <th>New Status</th>
    <th>Affected</th>
    <th>Date (WIB)</th>
</tr>
</thead>
<tbody>
@forelse ($logs as $log)
<tr>
    <td>{{ $log->id }}</td>
    <td>{{ $log->seat ? $log->seat->row_label . $log->seat->number : 'ALL' }}</td>
    <td>{{ $log->action }}</td>
    <td>{{ $log->user?->name ?? 'Deleted user' }}</td>
    <td>{{ $log->old_status === null ? 'UNKNOWN' : ($log->old_status ? 'ACTIVE' : 'INACTIVE') }}</td>
    <td>{{ $log->new_status === null ? 'UNKNOWN' : ($log->new_status ? 'ACTIVE' : 'INACTIVE') }}</td>
    <td>{{ $log->affected_seats }}</td>
    <td>{{ $log->created_at?->copy()->timezone('Asia/Jakarta')->format('d/m/Y H:i:s') }}</td>
</tr>
@empty
<tr>
    <td colspan="8">No activity records found.</td>
</tr>
@endforelse
</tbody>
</table>

<div class="footer">
    CineSight-X Control Center | Audit Report | Maximum 500 matching records
</div>

</body>
</html>