# Kravspecifikation (EPJ)

## MUST (MVP – uundværligt)
- Patientidentitet & basisdata (CPR/ID, navn, kontakt, pårørende, samtykke).
- Bruger- & adgangsstyring (roller: læge/sygeplejerske/admin), logning, rettigheder.
- Journalnotater pr. kontakt (tidsstempel, forfatter).  

## SHOULD (vælg 1–2 til første udvidelse)
- Diagnoseliste (aktive/historiske; evt. ICD).
- Medicin & ordinationer (aktuel liste, ændringer).
- Evt. Allergier, labs, vitale, filer, audit-UI.  

## NICE (bonus hvis tid)
- Patientportal, simpel beslutningsstøtte, kalender, FHIR/webhooks m.m.
- Tværgående: privatliv/sikkerhed, brugervenlighed, ydelse, sporbarhed, drift/test.  

## Definition of Done (MVP)
- Login med roller → opret/læs patient → opret kontakt → skriv note (versioneret).
- Audit-trail på centrale handlinger (læs/opret/opdater).  
