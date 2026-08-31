import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LandingFeature } from "./landing-features.data";

type FeatureCardProps = {
  feature: LandingFeature;
};

export function FeatureCard({ feature }: FeatureCardProps) {
  const FeatureIcon = feature.icon;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-3">
        <FeatureIcon className="size-6 text-primary" aria-hidden="true" />
        <CardTitle className="text-base">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{feature.description}</p>
      </CardContent>
    </Card>
  );
}
