import { motion } from "framer-motion";
import { Card } from "@/catalyst-ui/ui/card";
import { staggerContainer, fadeInStagger } from "@/catalyst-ui/effects";

export function StaggerAnimationDemo() {
  const items = ["Card 1", "Card 2", "Card 3", "Card 4", "Card 5", "Card 6"];

  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 gap-3"
    >
      {items.map((item, i) => (
        <motion.div key={i} variants={fadeInStagger("up", 20)}>
          <Card className="p-4 text-center">
            <span className="text-sm">{item}</span>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
