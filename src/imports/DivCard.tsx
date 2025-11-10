import svgPaths from "./svg-94btemm9bs";

function PTitleTextMargin() {
  return (
    <div className="absolute h-[21px] left-[24px] top-[1.5px] w-[51.66px]" data-name="p.title-text:margin">
      <div className="absolute flex flex-col font-['Roboto:Regular',_sans-serif] font-normal h-[21px] justify-center leading-[0] left-[8px] text-[18px] text-gray-700 top-[10.5px] translate-y-[-50%] w-[43.66px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Sales</p>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="absolute left-0 size-[20px] top-0" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_55_182)" id="SVG">
          <path d={svgPaths.p36a1d100} fill="var(--fill-0, #02972F)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_55_182">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function PPercent() {
  return (
    <div className="absolute h-[20px] left-[8px] top-0 w-[50.17px]" data-name="p.percent">
      <Svg />
      <div className="absolute flex flex-col font-['Roboto:SemiBold',_sans-serif] font-semibold h-[19px] justify-center leading-[0] left-[20px] text-[#02972f] text-[16px] top-[9.5px] translate-y-[-50%] w-[30.17px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">20%</p>
      </div>
    </div>
  );
}

function PPercentMargin() {
  return (
    <div className="absolute h-[20px] left-[75.66px] top-[2px] w-[58.17px]" data-name="p.percent:margin">
      <PPercent />
    </div>
  );
}

function Svg1() {
  return (
    <div className="absolute h-[16px] left-[2px] top-[4px] w-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 16">
        <g clipPath="url(#clip0_55_179)" id="SVG">
          <path d={svgPaths.p7a3e900} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_55_179">
            <rect fill="white" height="16" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span() {
  return (
    <div className="absolute bg-emerald-500 left-0 rounded-[9999px] size-[24px] top-1/2 translate-y-[-50%]" data-name="span">
      <Svg1 />
    </div>
  );
}

function DivTitle() {
  return (
    <div className="absolute h-[24px] left-[19px] right-[19px] top-[19px]" data-name="div.title">
      <PTitleTextMargin />
      <PPercentMargin />
      <Span />
    </div>
  );
}

function P() {
  return (
    <div className="absolute h-[40px] left-0 right-0 top-[16px]" data-name="p">
      <div className="absolute flex flex-col font-['Roboto:SemiBold',_sans-serif] font-semibold h-[42px] justify-center leading-[0] left-0 text-[36px] text-gray-800 top-[20px] translate-y-[-50%] w-[112.06px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[40px]">39,500</p>
      </div>
    </div>
  );
}

function PMargin() {
  return (
    <div className="absolute h-[72px] left-0 right-0 top-0" data-name="p:margin">
      <P />
    </div>
  );
}

function DivRange() {
  return (
    <div className="absolute bg-gray-200 h-[8px] left-0 right-0 rounded-[4px] top-[72px]" data-name="div.range">
      <div className="absolute bg-emerald-500 bottom-0 left-0 right-[24%] rounded-[4px] top-0" data-name="div.fill" />
    </div>
  );
}

function DivData() {
  return (
    <div className="absolute h-[80px] left-[19px] right-[19px] top-[43px]" data-name="div.data">
      <PMargin />
      <DivRange />
    </div>
  );
}

export default function DivCard() {
  return (
    <div className="bg-white relative rounded-[20px] size-full" data-name="div.card">
      <div aria-hidden="true" className="absolute border-[#323232] border-[3px] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[10px_10px_0px_0px_#323232]" />
      <DivTitle />
      <DivData />
    </div>
  );
}