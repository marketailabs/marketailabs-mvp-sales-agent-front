"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetLegalInfoQueryResult } from "@/sanity.types";
import { PortableText } from "next-sanity";

export default function LegalTabs({
  sections,
}: {
  sections: GetLegalInfoQueryResult;
}) {
  if (!sections || sections.length === 0) {
    return <p>No hay secciones legales disponibles.</p>;
  }

  return (
    <Tabs defaultValue={sections[0]?._id ?? ""} className="w-full">
      <TabsList className="flex flex-wrap gap-2 w-full">
        {sections.map((section) => (
          <TabsTrigger key={section._id} value={section._id}>
            {section.tabName ?? "Sin título"}
          </TabsTrigger>
        ))}
      </TabsList>

      {sections.map((section) => (
        <TabsContent
          key={section._id}
          value={section._id}
          className="bg-accent p-4 rounded-2xl"
        >
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="mb-2 text-2xl font-bold">
              {section.title ?? "Sin título"}
            </h2>
            {section.effectiveDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Vigente desde:{" "}
                {new Date(section.effectiveDate).toLocaleDateString()}
              </p>
            )}

            {/* Iterar subsecciones con null safety */}
            {section.sections?.map((sub, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="text-lg font-semibold mb-1">
                  {sub.heading ?? "Sin encabezado"}
                </h3>
                {sub.content && <PortableText value={sub.content} />}
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
