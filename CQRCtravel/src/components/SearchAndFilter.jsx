// 搜索和筛选组件

import { Input, Select } from 'antd';

const SearchAndFilter = ({ fieldConfig = {} }) => {
  const { select, search } = fieldConfig;

  return (
    <div
      className={`w-full ${select && search ? 'flex justify-between gap-12' : ''}`}
    >
      {select && (
        <Select
          value={select.value}
          placeholder={select.placeholder || ''}
          allowClear={select.allowClear || true}
          style={{ width: select.width || 400 }}
          options={select.optionsItem || []}
          showSearch={select.showSearch}
          mode={select.mode || 'multiple'}
          onChange={select.onChange}
        />
      )}

      {search && (
        <Input.Search
          placeholder={search.placeholder}
          style={{ width: search.width || 400 }}
          value={search.value}
          allowClear
          onChange={search.onChange}
          onSearch={search.onSearch}
          onClear={search.onClear}
          size={search.size || 'medium'}
        />
      )}
    </div>
  );
};

export default SearchAndFilter;
