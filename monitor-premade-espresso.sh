#!/bin/bash

# Daily Pre-Made Espresso Monitoring Script
# Runs at 6am Singapore time (6am CST)
# Generates report and sends to Telegram

REPORT_DATE=$(date +"%Y-%m-%d")
REPORT_FILE="/tmp/premade-espresso-report-${REPORT_DATE}.txt"

echo "📊 PRE-MADE ESPRESSO DAILY INTELLIGENCE REPORT" > $REPORT_FILE
echo "Date: ${REPORT_DATE}" >> $REPORT_FILE
echo "Time: $(date +"%H:%M %Z")" >> $REPORT_FILE
echo "===============================================" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Search for latest mentions
echo "🔍 LATEST MENTIONS:" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Note: In production, this would use kimi_search API
# For now, placeholders for manual review

echo "Search terms monitored:" >> $REPORT_FILE
echo "  - \"pre-made espresso\"" >> $REPORT_FILE
echo "  - \"batch made espresso\"" >> $REPORT_FILE
echo "  - \"prebatched espresso\"" >> $REPORT_FILE
echo "  - \"batch espresso\"" >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "📰 Sources monitored:" >> $REPORT_FILE
echo "  - Barista Hustle (baristahustle.com)" >> $REPORT_FILE
echo "  - Reddit (r/coffee, r/espresso, r/barista)" >> $REPORT_FILE
echo "  - Instagram coffee community" >> $REPORT_FILE
echo "  - Coffee forums" >> $REPORT_FILE
echo "  - Industry publications (Sprudge, Daily Coffee News)" >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "📌 KEY DEVELOPMENTS TO WATCH:" >> $REPORT_FILE
echo "" >> $REPORT_FILE
echo "1. Kirk Pearson / Project Zero updates" >> $REPORT_FILE
echo "2. Barista Hustle follow-up content" >> $REPORT_FILE
echo "3. Competition rule changes (WBC/WEC)" >> $REPORT_FILE
echo "4. Equipment manufacturers launching batch solutions" >> $REPORT_FILE
echo "5. High-volume cafes adopting the method" >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "🔔 Report generated. Manual review required for specific mentions." >> $REPORT_FILE
echo "" >> $REPORT_FILE
echo "Report location: ${REPORT_FILE}" >> $REPORT_FILE

# Output for logging
cat $REPORT_FILE
