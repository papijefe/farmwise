function DivLeaf() {
  return <div className="absolute bg-gradient-to-r from-[#b4c7b3] h-[40px] left-[0.59px] rounded-bl-[50px] rounded-tr-[50px] to-[#314328] top-[11.89px] w-[60px]" data-name="div.leaf" />;
}

export default function DivTooltipContainer() {
  return (
    <div className="relative size-full" data-name="div.tooltip-container">
      <DivLeaf />
    </div>
  );
}