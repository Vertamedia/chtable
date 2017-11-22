# Table plugin for [ClickHouse datasource](https://github.com/Vertamedia/chproxy)

CHTable is a modification of Grafana's [table plugin](https://grafana.com/plugins/table) with next features:
* Real pagination - sending queries with `LIMIT` parameter based on page number
* Query results caching for each page
* Detecting of total rows amount to build paging

> Plugin works only with ClickHouse datasource

### Quick start
Copy files to your [Grafana plugin directory](http://docs.grafana.org/plugins/installation/#grafana-plugin-directory).
Restart Grafana, check plugins list at http://your.grafana.instance/plugins.

### How to use

* Configure [ClickHouse datasource](https://github.com/Vertamedia/chproxy)
* Add `CHTable` panel to dashboard:
![select plugin](https://user-images.githubusercontent.com/2902918/33119689-6e1b65ee-cf78-11e7-9fd2-c83ca2e721b3.png)
* Choose `ClickHouse` as `Data Source`:
![select datasource](https://user-images.githubusercontent.com/2902918/33119686-6ddcace6-cf78-11e7-81b0-3caa302ac00a.png)
* Type query into editor. For example:
```
SELECT
    number
FROM system.numbers
LIMIT $__limit
```
> Where `$__limit` - is a special macros replaced with `LIMIT N, M` construction.
>> N = (current_page-1) * rows_per_page

>> M = rows_per_page
* Set `Format as` to `Table` option
* Go to `Options` tab and set params `Rows per page=10` and `Limit=50`:
![options](https://user-images.githubusercontent.com/2902918/33119688-6dfeaf8a-cf78-11e7-86e8-9b147a406efc.png)
* Save dashboard and reload page. Try to navigate pages
> Try to open Browser's Developer Tools and check sent requests

### Options > Paging
`Rows per page` - how many rows to fetch from database at once

`Limit` - total number of rows. If blank - plugin will do `select count() from $query` to count this number.
If you don't want plugin to send extra query - set some value (like 1000)


License
-------
MIT License, please see [LICENSE](https://github.com/Vertamedia/clickhouse-grafana/blob/master/LICENSE) for details.
