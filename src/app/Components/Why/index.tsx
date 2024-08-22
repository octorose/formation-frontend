import Image from "next/image";

interface WhyData {
  heading: string;
  subheading: string;
}

const whydata: WhyData[] = [
  {
    heading: "Quality",
    subheading:
      "Follow a hashtag growth total posts, videos and images.more revitions",
  },
  {
    heading: "Communication",
    subheading:
      "Follow a hashtag growth total posts, videos and images.more revitions",
  },
  {
    heading: "Reliability",
    subheading:
      "Follow a hashtag growth total posts, videos and images.more revitions",
  },
];

const Why = () => {
  return (
    <div id="about" className="py-10 sm:py-20">
      <div className="mx-auto  px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-18">
          {/* COLUMN-1 */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/assets/why/image.png"
              alt="iPad-image"
              width={4000}
              height={900}
              className="w-full h-auto max-w-lg lg:max-w-none"
            />
          </div>

          {/* COLUMN-2 */}
          <div className="flex flex-col justify-center">
            <h3 className="text-4xl lg:text-5xl font-semibold text-center lg:text-left">
              Why we best?
            </h3>
            <h4 className="text-lg pt-4 font-normal text-center lg:text-left text-beach">
              Don’t waste time on search manual tasks. Let Automation do it for
              you. Simplify workflows, reduce errors, and save time.
            </h4>

            <div className="mt-10 space-y-8">
              {whydata.map((item, i) => (
                <div className="flex items-start" key={i}>
                  <div className="rounded-full h-10 w-12 flex items-center justify-center bg-circlebg flex-shrink-0">
                    <Image
                      src="/assets/why/check.svg"
                      alt="check-image"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-2xl font-semibold">{item.heading}</h4>
                    <h5 className="text-lg text-beach font-normal mt-2">
                      {item.subheading}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Why;
