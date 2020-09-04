/*
 * MIT License
 *
 * Copyright (c) 2020 Dataline
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package io.dataline.workers;

import io.dataline.commons.functional.CloseableConsumer;
import io.dataline.commons.json.Jsons;
import io.dataline.config.SingerMessage;
import java.io.BufferedWriter;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TargetConsumer implements CloseableConsumer<SingerMessage> {

  private static final Logger LOGGER = LoggerFactory.getLogger(TargetConsumer.class);

  private final BufferedWriter writer;
  private final Process process;

  public TargetConsumer(BufferedWriter writer, Process process) {
    this.writer = writer;
    this.process = process;
  }

  @Override
  public void accept(SingerMessage record) {
    try {
      writer.write(Jsons.serialize(record));
      writer.newLine();
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public void close() throws IOException {
    // if the writer is not flushed, there is no guarantee all data will be written.
    writer.flush();
    WorkerUtils.closeProcess(process);
  }

}