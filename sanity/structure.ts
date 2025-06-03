import { Users, Home, LayoutTemplate } from "lucide-react";
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Dashboard")
    .items([
      // Home Section
      S.listItem()
        .title("Inicio")
        .icon(Home)
        .child(
          S.document()
            .schemaType("home")
            .documentId("home")
            .title("Editar Página de Inicio")
        ),

      S.divider(),

      // Forms Section
      S.listItem()
        .title("Formularios")
        .icon(LayoutTemplate)
        .child(
          S.list()
            .title("Formularios")
            .items([
              S.listItem()
                .title("Formularios")
                .schemaType("form")
                .child(S.documentTypeList("form").title("Formularios")),
              // Form inputs
              S.listItem()
                .title("Campos de Entrada")
                .schemaType("input")
                .child(S.documentTypeList("input").title("Campos de Entrada")),
            ])
        ),

      S.divider(),

      // Users Section
      S.listItem()
        .title("Usuarios")
        .icon(Users)
        .child(
          S.documentTypeList("user")
            .title("Usuarios")
            .child((userId) =>
              S.document()
                .schemaType("user")
                .documentId(userId)
                .views([S.view.form()])
            )
        ),
    ]);
