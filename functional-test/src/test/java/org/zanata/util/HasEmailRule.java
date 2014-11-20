/*
 * Copyright 2014, Red Hat, Inc. and individual contributors as indicated by the
 * @author tags. See the copyright.txt file in the distribution for a full
 * listing of individual contributors.
 *
 * This is free software; you can redistribute it and/or modify it under the
 * terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This software is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this software; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA, or see the FSF
 * site: http://www.fsf.org.
 */
package org.zanata.util;

import java.util.List;

import javax.mail.internet.MimeMultipart;

import org.junit.rules.TestRule;
import org.junit.runner.Description;
import org.junit.runners.model.Statement;
import org.subethamail.wiser.Wiser;
import org.subethamail.wiser.WiserMessage;
import com.google.common.base.Throwables;

/**
 * @author Patrick Huang
 *         <a href="mailto:pahuang@redhat.com">pahuang@redhat.com</a>
 */
public class HasEmailRule implements TestRule {
    private final Wiser wiser = new Wiser();

    public HasEmailRule() {
        String port = PropertiesHolder.getProperty("smtp.port");
        wiser.setPort(Integer.parseInt(port));
    }

    @Override
    public Statement apply(final Statement base, Description description) {
        return new Statement() {
            @Override
            public void evaluate() throws Throwable {
                wiser.start();
                try {
                    base.evaluate();
                } finally {
                    wiser.getMessages().clear();
                    wiser.stop();
                }
            }
        };
    }

    public List<WiserMessage> getMessages() {
        return wiser.getMessages();
    }

    public static String getEmailContent(WiserMessage wiserMessage) {
        try {
            return ((MimeMultipart) wiserMessage.getMimeMessage().getContent())
                    .getBodyPart(0).getContent().toString();
        } catch (Exception e) {
            throw Throwables.propagate(e);
        }
    }
}