import { offers } from "@/assets/offers";
import Button from "@/components/Button";
import Surface from "@/components/Surface";
import { H1, SubText, Text } from "@/components/Text";

const Bill = ({
  sent = 1,
  received = 0,
}: {
  sent?: number;
  received?: number;
}) => {
  return (
    <Surface className="flex flex-col gap-5">
      <H1>Current Plan</H1>
      <div className="w-full flex flex-col justify-start items-start gap-5">
        <Surface className="w-1/2 bg-primary/10! p-5 flex flex-col items-start justify-start gap-2">
          <Text className="text-primary! font-bold">Free Plan</Text>
          <SubText className="font-semibold">{`${sent + received}/200 message${sent + received !== 1 ? "s" : ""}`}</SubText>
          <Button className="mt-3">Upgrade Plan</Button>
        </Surface>
      </div>
      <H1>Offers</H1>
      <div className="w-full flex flex-wrap gap-5">
        {offers.map((o, i) => (
          <Surface
            key={i}
            className="w-full md:w-1/2 min-w-96 p-5 flex items-center justify-between gap-2"
          >
            <div className="flex-1 flex flex-col items-start justify-start">
              <div className="flex gap-3 ">
                <Text className="font-bold text-nowrap">{o.name}</Text>
                {o.sale && (
                  <SubText className="bg-primary/50! rounded-full px-2 text-sm font-medium text-nowrap">{o.sale}</SubText>
                )}
              </div>
              <SubText secondary className="font-semibold">
                {o.message}
              </SubText>
            </div>
            <div className="flex-1 flex flex-col items-end justify-end">
              <Text className="font-bold text-xl! text-nowrap">
                {o.price} DA<span className="text-sm font-medium">/Month</span>
              </Text>
            </div>
          </Surface>
        ))}
      </div>
    </Surface>
  );
};

export default Bill;
