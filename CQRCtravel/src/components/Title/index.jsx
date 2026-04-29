const Title = ({ titleData }) => {
  return (
    <div className="w-full py-12 text-center">
      <div className="text-5xl font-semibold text-gray-900 tracking-widest">
        {titleData.title}
      </div>
      <p className="w-52.5 h-0.75 bgColor-org mx-auto mt-6" />
      {titleData.desc && (
        <p className="text-slate-600 text-base tracking-widest mt-6">
          {titleData.desc}
        </p>
      )}
    </div>
  );
};

export default Title;
