import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const LookMore = ({ path, style }) => {
  return (
    <div className={`flex justify-end ${style === 'no' ? '' : 'pb-8'}`}>
      <div className="flex items-center cursor-pointer text-gray-500 hover:text-gray-900 hover:font-semibold">
        <Link to={path} target="_blank" rel="noopener noreferrer">
          查看更多
        </Link>
        <RightOutlined />
      </div>
    </div>
  );
};

export default LookMore;
