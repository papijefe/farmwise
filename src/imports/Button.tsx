export default function Button() {
  return (
    <div className="bg-neutral-800 relative rounded-[8px] size-full" data-name="Button">
      <div className="overflow-clip relative size-full">
        <div className="absolute flex flex-col font-['Roboto:SemiBold',_sans-serif] font-semibold h-[19px] justify-center leading-[0] left-[13px] text-[16px] text-gray-50 top-[31.5px] translate-y-[-50%] w-[68.36px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[24px] underline">See more</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#767676] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}