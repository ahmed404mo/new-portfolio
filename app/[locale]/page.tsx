import Background from "@/components/modules/Background";

export default function HomePage() {
  return (
    <div className="relative h-[calc(100vh-4rem)] min-h-[600px] w-full overflow-hidden">
      <Background
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
